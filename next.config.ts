import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentUpgrade: "security",
  },
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
