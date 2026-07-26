"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Root route just forwards to the dashboard; the (dashboard) layout
// guard redirects to /login if there's no authenticated session.
// Client-side navigation (not next/navigation's server redirect()) so
// this works in a static export, which the Capacitor Android build uses.
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return null;
}
