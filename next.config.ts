import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/playwright-ts-learn",
  images: {
    unoptimized: true,
  },
  typescript: {
    // Ignores missing package errors like socket.io-client during build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
