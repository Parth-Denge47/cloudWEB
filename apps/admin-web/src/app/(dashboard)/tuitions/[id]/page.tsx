import { TuitionDetailClient } from "./TuitionDetailClient";
import { tuitions } from "@/data/mock/seed-data";

// Static export (used by the Capacitor/Android build) requires every
// dynamic segment to be enumerable at build time. Mock tuition ids are
// known ahead of time, so we list them here; a real backend-driven build
// would generate this list from an API call instead.
export function generateStaticParams() {
  return tuitions.map((tuition) => ({ id: tuition.id }));
}

// Only ids returned above are routable in the static export build.
export const dynamicParams = false;

export default async function TuitionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TuitionDetailClient tuitionId={id} />;
}
