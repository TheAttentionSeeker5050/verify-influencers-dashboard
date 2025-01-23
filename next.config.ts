import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    POSTGRES_DATABASE_URL: process.env.POSTGRES_DATABASE_URL,
  },
};

export default nextConfig;
