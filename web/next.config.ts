import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Enable Turbopack persistent caching for faster cold starts in development
    turbopackPersistentCaching: true,
  },
};

export default nextConfig;
