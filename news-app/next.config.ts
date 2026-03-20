import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export" only when building for Android (BUILD_FOR_ANDROID=true npm run build)
  // In dev mode, the server runs normally so the RSS proxy API route works
  output: process.env.BUILD_FOR_ANDROID === "true" ? "export" : undefined,
};

export default nextConfig;
