import { VehicleSchema, FuelSchema, AxleSchema, APKHistorySchema, type VehicleData, type FuelData, type AxleData, type APKHistoryData } from './schemas';

const RDW_BASE_URL = 'https://opendata.rdw.nl/resource';

const vehicleCache = new Map<string, { data: { vehicle: VehicleData | null; fuel: FuelData | null; axles: AxleData[] }; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000;
const MAX_CACHE_SIZE = 1000;

function cleanupCache() {
  const now = Date.now();
  if (vehicleCache.size > MAX_CACHE_SIZE) {
    for (const [key, entry] of vehicleCache.entries()) {
      if (now - entry.timestamp > CACHE_TTL) {
        vehicleCache.delete(key);
      }
    }
  }
  if (vehicleCache.size > MAX_CACHE_SIZE) {
    const entries = Array.from(vehicleCache.entries()).sort((a, b) => a[1].timestamp - b[1].timestamp);
    const toDelete = entries.slice(0, vehicleCache.size - MAX_CACHE_SIZE);
    toDelete.forEach(([key]) => vehicleCache.delete(key));
  }
}

export async function getVehicleData(kenteken: string): Promise<{ vehicle: VehicleData | null; fuel: FuelData | null; axles: AxleData[] }> {
  const normalizedPlate = kenteken.replace(/-/g, '').toUpperCase();
  
  cleanupCache();
  
  const cached = vehicleCache.get(normalizedPlate);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };

  // Add RDW app token if available
  if (process.env.RDW_APP_TOKEN) {
    headers['X-App-Token'] = process.env.RDW_APP_TOKEN;
  }

  try {
    const vehicleUrl = `${RDW_BASE_URL}/m9d7-ebf2.json?kenteken=${encodeURIComponent(normalizedPlate)}`;
    const fuelUrl = `${RDW_BASE_URL}/8ys7-d773.json?kenteken=${encodeURIComponent(normalizedPlate)}`;
    const axleUrl = `${RDW_BASE_URL}/3huj-srit.json?kenteken=${encodeURIComponent(normalizedPlate)}`;

    const [vehicleRes, fuelRes, axleRes] = await Promise.all([
      fetch(vehicleUrl, { headers }),
      fetch(fuelUrl, { headers }),
      fetch(axleUrl, { headers })
    ]);

    if (!vehicleRes.ok) throw new Error(`RDW API error: ${vehicleRes.status}`);
    if (!fuelRes.ok) throw new Error(`RDW API error: ${fuelRes.status}`);
    if (!axleRes.ok) throw new Error(`RDW API error: ${axleRes.status}`);

    const [vehicleData, fuelData, axleData] = await Promise.all([
      vehicleRes.json(),
      fuelRes.json(),
      axleRes.json()
    ]);
    
    const vehicle = vehicleData.length > 0 ? VehicleSchema.parse(vehicleData[0]) : null;
    const fuel = fuelData.length > 0 ? FuelSchema.parse(fuelData[0]) : null;
    const axles = axleData.map((a: unknown) => AxleSchema.parse(a)) as AxleData[];

    const result = { vehicle, fuel, axles };

    vehicleCache.set(normalizedPlate, { data: result, timestamp: Date.now() });

    return result;
  } catch (error) {
    console.error('Error fetching RDW data:', error);
    throw error;
  }
}

export async function getAPKHistory(kenteken: string): Promise<APKHistoryData[]> {
  return [];
}

export function clearCache() {
  vehicleCache.clear();
}
