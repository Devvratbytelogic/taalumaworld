import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dev-api.taaluma.world",
        pathname: "/public/**",
      },
      {
        protocol: "https",
        hostname: "taluma.plan-it.pro",
        pathname: "/public/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75],
    deviceSizes: [640, 750, 828, 1080, 1200, 1536, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 480],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    unoptimized: false,
  },
  experimental: {
    serverActions: {},
  },
};

export default nextConfig;
