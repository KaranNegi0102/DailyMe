import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "via.placeholder.com",
      "images.squarespace-cdn.com",
      "res.cloudinary.com",
      "images.unsplash.com",
      "plus.unsplash.com"
    ],
  },
};

export default nextConfig;
