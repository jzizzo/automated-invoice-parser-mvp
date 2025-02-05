import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // This setting allows production builds to complete even if there are ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // This setting allows production builds to complete even if there are TypeScript errors.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
