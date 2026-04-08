import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

function toRemotePattern(value?: string): RemotePattern | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    const protocol = url.protocol.replace(":", "") as RemotePattern["protocol"];

    return {
      protocol,
      hostname: url.hostname,
      port: url.port,
      pathname: "/**",
    };
  } catch {
    return null;
  }
}

const remotePatterns = [
  {
    protocol: "https",
    hostname: "res.cloudinary.com",
    pathname: "/**",
  },
  toRemotePattern(process.env.NEXT_PUBLIC_API_URL),
  toRemotePattern(process.env.NEXT_PUBLIC_FRONTEND_URL),
].filter(Boolean) as RemotePattern[];

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "Content-Security-Policy", value: "default-src 'self' http://localhost:* http://127.0.0.1:* ws://localhost:* ws://127.0.0.1:* https://*.googleapis.com https://*.gstatic.com https://res.cloudinary.com 'unsafe-inline' 'unsafe-eval';" },
        ],
      },
    ];
  },
};

export default nextConfig;
