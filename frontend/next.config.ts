import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["image.tmdb.org", "www.gravatar.com"],
  },
  reactStrictMode: true,
};

export default nextConfig;
