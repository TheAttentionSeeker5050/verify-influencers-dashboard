import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    POSTGRES_DATABASE_URL: process.env.POSTGRES_DATABASE_URL,
    OPEN_AI_URL: process.env.OPEN_AI_URL,
    OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY,
    OPEN_AI_PROJECT_ID: process.env.OPEN_AI_PROJECT_ID,
    OPEN_AI_ORG_ID: process.env.OPEN_AI_ORG_ID,
  },
};

export default nextConfig;
