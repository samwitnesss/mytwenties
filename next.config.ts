import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.leadconnectorhq.com https://*.msgsndr.com; style-src 'self' 'unsafe-inline'; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.leadconnectorhq.com https://*.msgsndr.com; img-src 'self' data: https:; font-src 'self' data:; frame-src https://*.leadconnectorhq.com https://*.msgsndr.com; object-src 'none'; base-uri 'self'; form-action 'self';" },
      ],
    },
  ],
};

export default nextConfig;
