import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // GitHub Pages static export settings.
  // To build a static site for GitHub Pages:
  //   1. comment out `output: "standalone"` above
  //   2. uncomment the four lines below
  //   3. set basePath / assetPrefix to "/<repo-name>/" if publishing under
  //      https://<user>.github.io/<repo>/ — leave unset for <user>.github.io
  // output: "export",
  // images: { unoptimized: true },
  // basePath: "/<repo-name>",
  // assetPrefix: "/<repo-name>/",
};

export default nextConfig;
