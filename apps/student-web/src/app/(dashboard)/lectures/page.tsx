"use client";

import { useEffect, useMemo, useState } from "react";
import { PlayCircle, Video as VideoIcon, Clock } from "lucide-react";
import { PageHeader } from "@/presentation/components/ui/PageHeader";
import { SearchInput } from "@/presentation/components/ui/SearchInput";
import { Badge } from "@/presentation/components/ui/Badge";
import { LoadingState } from "@/presentation/components/ui/LoadingState";
import { EmptyState } from "@/presentation/components/ui/EmptyState";
import { VideoPreviewModal } from "@/presentation/components/lectures/VideoPreviewModal";
import { useAuth } from "@/state/auth-context";
import { lectureService } from "@/services/lecture.service";
import { VideoLecture } from "@/domain/models/video-lecture.model";
import { formatDate } from "@/utils/format";

// Students watch lectures only through this embedded player — never the
// raw YouTube app or its recommendations, per spec.
export default function LecturesPage() {
  const { student } = useAuth();
  const [lectures, setLectures] = useState<VideoLecture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [previewLecture, setPreviewLecture] = useState<VideoLecture | null>(null);

  useEffect(() => {
    if (!student) return;
    void (async () => {
      setIsLoading(true);
      const result = await lectureService.getAll({ tuitionId: student.tuitionId });
      setLectures(result);
      setIsLoading(false);
    })();
  }, [student]);

  const filteredLectures = useMemo(
    () => lectures.filter((l) => !search || l.title.toLowerCase().includes(search.toLowerCase())),
    [lectures, search]
  );

  return (
    <div>
      <PageHeader title="Lectures" description="Watch recorded lectures uploaded by your teachers." />
      <SearchInput value={search} onChange={setSearch} placeholder="Search lectures" className="mb-4 max-w-xs" />

      {isLoading ? (
        <LoadingState label="Loading lectures..." />
      ) : filteredLectures.length === 0 ? (
        <EmptyState icon={VideoIcon} title="No lectures found" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredLectures.map((lecture) => (
            <button
              key={lecture.id}
              onClick={() => setPreviewLecture(lecture)}
              className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white text-left shadow-sm shadow-slate-900/[0.02] transition-shadow hover:shadow-md"
            >
              <div className="group relative flex aspect-video items-center justify-center bg-slate-900">
                <PlayCircle className="size-10 text-white/90 transition-transform group-hover:scale-110" />
                <span className="absolute right-2 bottom-2 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[11px] text-white">
                  <Clock className="size-3" /> {lecture.durationMinutes}m
                </span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="line-clamp-1 font-medium text-slate-800">{lecture.title}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-slate-400">{lecture.description}</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <Badge tone="brand">{lecture.subject}</Badge>
                  <Badge tone="neutral">{lecture.course}</Badge>
                </div>
                <p className="mt-3 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
                  {lecture.uploadedByName} · {formatDate(lecture.uploadDate)}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      <VideoPreviewModal open={Boolean(previewLecture)} lecture={previewLecture} onClose={() => setPreviewLecture(null)} />
    </div>
  );
}
