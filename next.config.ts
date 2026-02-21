import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';

// 2026 Best Practice:
// - Dev: allow unsafe-inline/eval for HMR and debugging
// - Prod: Next.js requires unsafe-inline for hydration (true nonce CSP needs middleware)
const cspScriptSrc = isDev
  ? "'self' 'unsafe-inline' 'unsafe-eval'"
  : "'self' 'unsafe-inline'";

const cspStyleSrc = "'self' 'unsafe-inline'";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'" },
        ],
      },
    ];
  },
};

export default nextConfig;
