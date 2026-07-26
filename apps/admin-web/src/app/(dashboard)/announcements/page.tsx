"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Megaphone, Radio } from "lucide-react";
import { PageHeader } from "@/presentation/components/ui/PageHeader";
import { Button } from "@/presentation/components/ui/Button";
import { SearchInput } from "@/presentation/components/ui/SearchInput";
import { Badge } from "@/presentation/components/ui/Badge";
import { LoadingState } from "@/presentation/components/ui/LoadingState";
import { EmptyState } from "@/presentation/components/ui/EmptyState";
import { ConfirmDialog } from "@/presentation/components/ui/ConfirmDialog";
import { RowActionsMenu } from "@/presentation/components/ui/RowActionsMenu";
import { AnnouncementFormModal } from "@/presentation/components/announcements/AnnouncementFormModal";
import { announcementService } from "@/services/announcement.service";
import { tuitionService } from "@/services/tuition.service";
import { Announcement, AnnouncementInput } from "@/domain/models/announcement.model";
import { Tuition } from "@/domain/models/tuition.model";
import { formatDateTime } from "@/utils/format";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [formKey, setFormKey] = useState(0); // bumped on every open to force a fresh form instance
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  async function loadData() {
    setIsLoading(true);
    const [announcementList, tuitionList] = await Promise.all([announcementService.getAll(), tuitionService.getAll()]);
    setAnnouncements(announcementList);
    setTuitions(tuitionList);
    setIsLoading(false);
  }

  useEffect(() => {
    void (async () => {
      await loadData();
    })();
  }, []);

  const filteredAnnouncements = useMemo(
    () => announcements.filter((a) => !search || a.title.toLowerCase().includes(search.toLowerCase())),
    [announcements, search]
  );

  function tuitionName(id: string | null) {
    if (!id) return "All Tuitions";
    return tuitions.find((t) => t.id === id)?.tuitionName ?? "Unknown Tuition";
  }

  async function handleCreateOrUpdate(input: AnnouncementInput) {
    if (editingAnnouncement) {
      const updated = await announcementService.update(editingAnnouncement.id, input);
      setAnnouncements((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    } else {
      const created = await announcementService.create(input);
      setAnnouncements((prev) => [created, ...prev]);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsActionLoading(true);
    try {
      await announcementService.delete(deleteTarget.id);
      setAnnouncements((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      setDeleteTarget(null);
    } finally {
      setIsActionLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Announcements"
        description="Create, edit, and broadcast announcements across tuitions."
        actions={
          <Button
            onClick={() => {
              setEditingAnnouncement(null);
              setFormKey((k) => k + 1);
              setFormOpen(true);
            }}
          >
            <Plus className="size-4" /> Create Announcement
          </Button>
        }
      />

      <SearchInput value={search} onChange={setSearch} placeholder="Search announcements" className="mb-4 max-w-xs" />

      {isLoading ? (
        <LoadingState label="Loading announcements..." />
      ) : filteredAnnouncements.length === 0 ? (
        <EmptyState icon={Megaphone} title="No announcements found" description="Try a different search." />
      ) : (
        <div className="space-y-3">
          {filteredAnnouncements.map((announcement) => (
            <div key={announcement.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-900/[0.02]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-800">{announcement.title}</p>
                    {announcement.isBroadcast && (
                      <Badge tone="warning">
                        <span className="flex items-center gap-1">
                          <Radio className="size-3" /> Broadcast
                        </span>
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{announcement.message}</p>
                </div>
                <RowActionsMenu
                  actions={[
                    {
                      label: "Edit",
                      icon: Pencil,
                      onClick: () => {
                        setEditingAnnouncement(announcement);
                        setFormKey((k) => k + 1);
                        setFormOpen(true);
                      },
                    },
                    { label: "Delete", icon: Trash2, danger: true, onClick: () => setDeleteTarget(announcement) },
                  ]}
                />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-400">
                <span>{tuitionName(announcement.tuitionId)}</span>
                <span>·</span>
                <span className="capitalize">{announcement.audience === "all" ? "Everyone" : announcement.audience}</span>
                <span>·</span>
                <span>
                  {announcement.createdByName} ({announcement.createdByRole})
                </span>
                <span>·</span>
                <span>{formatDateTime(announcement.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnnouncementFormModal
        key={formKey}
        open={formOpen}
        announcement={editingAnnouncement}
        tuitions={tuitions}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreateOrUpdate}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Announcement"
        message={`"${deleteTarget?.title}" will be permanently removed.`}
        confirmLabel="Delete"
        tone="danger"
        isLoading={isActionLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
