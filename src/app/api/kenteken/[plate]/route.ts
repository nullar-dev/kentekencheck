import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getVehicleData, getAPKHistory } from '@/lib/rdw/client';
import { VehicleResponseSchema } from '@/lib/rdw/schemas';

// Input validation schema
const PlateParamsSchema = z.object({
  plate: z.string().min(1).max(10).regex(/^[A-Z0-9-]+$/i, 'Invalid license plate format'),
});

// Rate limiter with max size to prevent memory exhaustion
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10;
const RATE_LIMIT_WINDOW = 60 * 1000;
const CLEANUP_INTERVAL = 5 * 60 * 1000;
const MAX_RATE_LIMIT_ENTRIES = 10000;

function cleanupRateLimitMap() {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}

if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitMap, CLEANUP_INTERVAL);
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  
  if (rateLimitMap.size >= MAX_RATE_LIMIT_ENTRIES) {
    cleanupRateLimitMap();
    if (rateLimitMap.size >= MAX_RATE_LIMIT_ENTRIES) {
      return true;
    }
  }
  
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

// Rate limit: 10 requests per minute per IP
export const runtime = 'nodejs';
export const maxDuration = 30;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ plate: string }> }
) {
  const { plate } = await params;

  // Validate input
  const validation = PlateParamsSchema.safeParse({ plate });
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Ongeldig kenteken formaat' },
      { status: 400 }
    );
  }

  // Rate limiting - extract client IP properly to prevent spoofing
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  let ip = 'unknown';
  if (forwardedFor) {
    const parts = forwardedFor.split(',');
    ip = parts[0]?.trim() ?? 'unknown';
  } else if (realIp) {
    ip = realIp;
  }
  const rateLimitOk = checkRateLimit(ip);

  if (!rateLimitOk) {
    return NextResponse.json(
      { error: 'Te veel verzoeken. Probeer het later opnieuw.' },
      { status: 429 }
    );
  }

  try {
    const vehicleData = await getVehicleData(plate);
    const apkHistory = await getAPKHistory();

    const response = VehicleResponseSchema.parse({
      vehicle: vehicleData.vehicle,
      fuel: vehicleData.fuel,
      axles: vehicleData.axles,
      apkHistory,
    });

    // Cache response for 1 hour (CDN/browser)
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching vehicle data:', error);
    
    // Check if RDW API is unavailable
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage.includes('503') || errorMessage.includes('Service Unavailable')) {
      return NextResponse.json(
        { error: 'RDW API is tijdelijk niet beschikbaar. Probeer het later opnieuw.' },
        { status: 503 }
      );
    }
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ongeldige respons van RDW API' },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: 'Kon voertuiggegevens niet ophalen' },
      { status: 500 }
    );
  }
}
