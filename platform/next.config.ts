import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this app (a stray lockfile in the user's home dir
  // otherwise makes Next infer the wrong root).
  turbopack: {
    root: path.join(__dirname),
  },
  // Tenant sites use uploaded/remote images from any host in production.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async headers() {
    const base = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    ];
    // Admin panels can't be framed by other sites (clickjacking); same-origin preview frames still work.
    const noFrame = [...base, { key: "X-Frame-Options", value: "SAMEORIGIN" }];
    return [
      { source: "/:path*", headers: base },
      { source: "/admin/:path*", headers: noFrame },
      { source: "/super/:path*", headers: noFrame },
    ];
  },
};

export default nextConfig;
