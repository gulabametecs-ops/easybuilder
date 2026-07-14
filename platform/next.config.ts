import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this app (a stray lockfile in the user's home dir
  // otherwise makes Next infer the wrong root).
  turbopack: {
    root: path.join(__dirname),
  },
  // Native / DB driver packages must not be bundled — keep them external so
  // Vercel traces them correctly at runtime.
  serverExternalPackages: ["@prisma/adapter-pg", "@prisma/adapter-better-sqlite3", "better-sqlite3", "pg"],
  // Tenant sites use uploaded/remote images from any host in production.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
