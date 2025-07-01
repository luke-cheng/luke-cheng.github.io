import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Default to static export unless ENABLE_API_ROUTES is set
  ...(process.env.ENABLE_API_ROUTES !== 'true' && {
    output: 'export',
    trailingSlash: true,
    images: {
      unoptimized: true
    }
  }),
};

export default nextConfig;
