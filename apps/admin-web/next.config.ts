import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export so the app can be bundled into the Capacitor Android
  // shell (no Node.js server available inside the APK).
  output: "export",
  trailingSlash: true,
};

export default nextConfig;
