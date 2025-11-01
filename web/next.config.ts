import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Turbopack is enabled by default in Next.js 16
	// Persistent caching requires canary version - removed for stable 16.0.1
	experimental: {},
};

export default nextConfig;
