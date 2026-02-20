import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';

const cspScriptSrc = isDev
  ? "'self' 'unsafe-inline' 'unsafe-eval'"
  : "'self' 'nonce-:nonce)' 'strict-dynamic'";

const cspStyleSrc = isDev
  ? "'self' 'unsafe-inline'"
  : "'self' 'nonce-:nonce)'";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  
  compress: true,
  
  generateEtags: true,
  
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js', 'lucide-react'],
  },
  
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'Content-Security-Policy', value: `default-src 'self'; script-src ${cspScriptSrc}; style-src ${cspStyleSrc}; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co https://api.stripe.com https://opendata.rdw.nl; frame-ancestors 'none';` },
        ],
      },
    ];
  },
};

export default nextConfig;
