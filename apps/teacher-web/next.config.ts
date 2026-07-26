import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export so the app can be bundled into a Capacitor Android
  // shell later (no Node.js server available inside an APK).
  output: "export",
  trailingSlash: true,
};

export default nextConfig;
