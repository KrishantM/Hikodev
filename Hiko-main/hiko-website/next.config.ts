import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Exclude the mobile app directory from the build
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['src'],
  },
};

export default nextConfig;
