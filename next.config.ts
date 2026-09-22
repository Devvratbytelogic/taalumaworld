import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dev-api.taaluma.world",
      },
      // {
      //   protocol: "http",
      //   hostname: "*",
      // },
    ],
    unoptimized: false,
  },
  experimental: {
    serverActions: {},
  },
};

export default nextConfig;
