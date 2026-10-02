import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/playwright-ts-learn",
  assetPrefix: "/playwright-ts-learn/",
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
