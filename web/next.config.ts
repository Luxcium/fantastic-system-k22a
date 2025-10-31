import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Enable Turbopack file system cache for faster cold starts in development
    turbopackFileSystemCacheForDev: true,
  },
  // Note: cacheComponents is experimental and not compatible with dynamic route segments
  // Enable when your routes are fully compatible:
  // cacheComponents: true,
};

export default nextConfig;
