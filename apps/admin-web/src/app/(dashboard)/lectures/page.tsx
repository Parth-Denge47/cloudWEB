"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, PlayCircle, Video as VideoIcon, Clock } from "lucide-react";
import { PageHeader } from "@/presentation/components/ui/PageHeader";
import { Button } from "@/presentation/components/ui/Button";
import { SearchInput } from "@/presentation/components/ui/SearchInput";
import { Badge } from "@/presentation/components/ui/Badge";
import { LoadingState } from "@/presentation/components/ui/LoadingState";
import { EmptyState } from "@/presentation/components/ui/EmptyState";
import { ConfirmDialog } from "@/presentation/components/ui/ConfirmDialog";
import { RowActionsMenu } from "@/presentation/components/ui/RowActionsMenu";
import { LectureFormModal } from "@/presentation/components/lectures/LectureFormModal";
import { VideoPreviewModal } from "@/presentation/components/lectures/VideoPreviewModal";
import { lectureService } from "@/services/lecture.service";
import { tuitionService } from "@/services/tuition.service";
import { VideoLecture, VideoLectureInput } from "@/domain/models/video-lecture.model";
import { Tuition } from "@/domain/models/tuition.model";
import { formatDate } from "@/utils/format";

export default function LecturesPage() {
  const [lectures, setLectures] = useState<VideoLecture[]>([]);
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [formKey, setFormKey] = useState(0); // bumped on every open to force a fresh form instance
  const [editingLecture, setEditingLecture] = useState<VideoLecture | null>(null);
  const [previewLecture, setPreviewLecture] = useState<VideoLecture | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<VideoLecture | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  async function loadData() {
    setIsLoading(true);
    const [lectureList, tuitionList] = await Promise.all([lectureService.getAll(), tuitionService.getAll()]);
    setLectures(lectureList);
    setTuitions(tuitionList);
    setIsLoading(false);
  }

  useEffect(() => {
    void (async () => {
      await loadData();
    })();
  }, []);

  const filteredLectures = useMemo(
    () => lectures.filter((l) => !search || l.title.toLowerCase().includes(search.toLowerCase())),
    [lectures, search]
  );

  async function handleCreateOrUpdate(input: VideoLectureInput) {
    if (editingLecture) {
      const updated = await lectureService.update(editingLecture.id, input);
      setLectures((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    } else {
      const created = await lectureService.create(input);
      setLectures((prev) => [created, ...prev]);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsActionLoading(true);
    try {
      await lectureService.delete(deleteTarget.id);
      setLectures((prev) => prev.filter((l) => l.id !== deleteTarget.id));
      setDeleteTarget(null);
    } finally {
      setIsActionLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Video Lectures"
        description="Unlisted YouTube lectures — students only ever see the embedded player."
        actions={
          <Button
            onClick={() => {
              setEditingLecture(null);
              setFormKey((k) => k + 1);
              setFormOpen(true);
            }}
          >
            <Plus className="size-4" /> Upload Lecture
          </Button>
        }
      />

      <SearchInput value={search} onChange={setSearch} placeholder="Search lectures" className="mb-4 max-w-xs" />

      {isLoading ? (
        <LoadingState label="Loading lectures..." />
      ) : filteredLectures.length === 0 ? (
        <EmptyState icon={VideoIcon} title="No lectures found" description="Try a different search." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredLectures.map((lecture) => (
            <div key={lecture.id} className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm shadow-slate-900/[0.02]">
              <button
                onClick={() => setPreviewLecture(lecture)}
                className="group relative flex aspect-video items-center justify-center bg-slate-900"
              >
                <PlayCircle className="size-10 text-white/90 transition-transform group-hover:scale-110" />
                <span className="absolute right-2 bottom-2 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[11px] text-white">
                  <Clock className="size-3" /> {lecture.durationMinutes}m
                </span>
              </button>
              <div className="flex flex-1 flex-col p-4">
                <p className="line-clamp-1 font-medium text-slate-800">{lecture.title}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-slate-400">{lecture.description}</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <Badge tone="brand">{lecture.subject}</Badge>
                  <Badge tone="neutral">{lecture.course}</Badge>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                  <div>
                    <p className="text-xs text-slate-500">{lecture.uploadedByName}</p>
                    <p className="text-[11px] text-slate-400">{formatDate(lecture.uploadDate)}</p>
                  </div>
                  <RowActionsMenu
                    actions={[
                      {
                        label: "Edit",
                        icon: Pencil,
                        onClick: () => {
                          setEditingLecture(lecture);
                          setFormKey((k) => k + 1);
                          setFormOpen(true);
                        },
                      },
                      { label: "Delete", icon: Trash2, danger: true, onClick: () => setDeleteTarget(lecture) },
                    ]}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <LectureFormModal key={formKey} open={formOpen} lecture={editingLecture} tuitions={tuitions} onClose={() => setFormOpen(false)} onSubmit={handleCreateOrUpdate} />
      <VideoPreviewModal open={Boolean(previewLecture)} lecture={previewLecture} onClose={() => setPreviewLecture(null)} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Lecture"
        message={`"${deleteTarget?.title}" will be permanently removed and students will no longer be able to watch it.`}
        confirmLabel="Delete"
        tone="danger"
        isLoading={isActionLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
