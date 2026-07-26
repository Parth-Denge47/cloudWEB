"use client";

import { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";
import { PageHeader } from "@/presentation/components/ui/PageHeader";
import { Badge } from "@/presentation/components/ui/Badge";
import { LoadingState } from "@/presentation/components/ui/LoadingState";
import { EmptyState } from "@/presentation/components/ui/EmptyState";
import { useAuth } from "@/state/auth-context";
import { announcementService } from "@/services/announcement.service";
import { Announcement } from "@/domain/models/announcement.model";
import { formatDateTime } from "@/utils/format";

export default function AnnouncementsPage() {
  const { student } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!student) return;
    void (async () => {
      setIsLoading(true);
      const result = await announcementService.getAll({ tuitionId: student.tuitionId });
      setAnnouncements(result);
      setIsLoading(false);
    })();
  }, [student]);

  return (
    <div>
      <PageHeader title="Announcements" description="Updates from your teachers and the Admin team." />

      {isLoading ? (
        <LoadingState label="Loading announcements..." />
      ) : announcements.length === 0 ? (
        <EmptyState icon={Megaphone} title="No announcements yet" />
      ) : (
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-900/[0.02]">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-slate-800">{announcement.title}</p>
                {announcement.isBroadcast && <Badge tone="warning">Broadcast</Badge>}
              </div>
              <p className="mt-1 text-sm text-slate-500">{announcement.message}</p>
              <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-400">
                {announcement.createdByName} ({announcement.createdByRole}) · {formatDateTime(announcement.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
