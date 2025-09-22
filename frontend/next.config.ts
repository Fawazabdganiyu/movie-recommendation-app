import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["image.tmdb.org", "www.gravatar.com"],
  },
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
