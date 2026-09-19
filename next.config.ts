import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product photos are pre-sized in public/images, so serve them as-is.
    unoptimized: true,
  },
};

export default nextConfig;
