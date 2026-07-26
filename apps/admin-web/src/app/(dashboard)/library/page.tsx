"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Download, Library as LibraryIcon, FileText } from "lucide-react";
import { PageHeader } from "@/presentation/components/ui/PageHeader";
import { Button } from "@/presentation/components/ui/Button";
import { SearchInput } from "@/presentation/components/ui/SearchInput";
import { Badge } from "@/presentation/components/ui/Badge";
import { TableContainer, TableHead, Th, TableBody, Tr, Td } from "@/presentation/components/ui/Table";
import { LoadingState } from "@/presentation/components/ui/LoadingState";
import { EmptyState } from "@/presentation/components/ui/EmptyState";
import { ConfirmDialog } from "@/presentation/components/ui/ConfirmDialog";
import { RowActionsMenu } from "@/presentation/components/ui/RowActionsMenu";
import { LibraryFileModal } from "@/presentation/components/library/LibraryFileModal";
import { libraryService } from "@/services/library.service";
import { tuitionService } from "@/services/tuition.service";
import { LibraryFile, LibraryFileInput } from "@/domain/models/library-file.model";
import { Tuition } from "@/domain/models/tuition.model";
import { LIBRARY_FILE_TYPE_LABELS, LibraryFileType } from "@/domain/models/enums";
import { formatDate, formatFileSize } from "@/utils/format";

export default function LibraryPage() {
  const [files, setFiles] = useState<LibraryFile[]>([]);
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | LibraryFileType>("all");

  const [formOpen, setFormOpen] = useState(false);
  const [formKey, setFormKey] = useState(0); // bumped on every open to force a fresh form instance
  const [editingFile, setEditingFile] = useState<LibraryFile | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LibraryFile | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  async function loadData() {
    setIsLoading(true);
    const [fileList, tuitionList] = await Promise.all([libraryService.getAll(), tuitionService.getAll()]);
    setFiles(fileList);
    setTuitions(tuitionList);
    setIsLoading(false);
  }

  useEffect(() => {
    void (async () => {
      await loadData();
    })();
  }, []);

  const filteredFiles = useMemo(() => {
    return files.filter((f) => {
      const matchesSearch = !search || f.title.toLowerCase().includes(search.toLowerCase()) || f.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchesType = typeFilter === "all" || f.fileType === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [files, search, typeFilter]);

  async function handleCreateOrUpdate(input: LibraryFileInput) {
    if (editingFile) {
      const updated = await libraryService.update(editingFile.id, input);
      setFiles((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
    } else {
      const created = await libraryService.upload(input);
      setFiles((prev) => [created, ...prev]);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsActionLoading(true);
    try {
      await libraryService.delete(deleteTarget.id);
      setFiles((prev) => prev.filter((f) => f.id !== deleteTarget.id));
      setDeleteTarget(null);
    } finally {
      setIsActionLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Library"
        description="Notes, books, PDFs, assignments, and reference material across every tuition."
        actions={
          <Button
            onClick={() => {
              setEditingFile(null);
              setFormKey((k) => k + 1);
              setFormOpen(true);
            }}
          >
            <Plus className="size-4" /> Upload File
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by title or tag" className="max-w-xs" />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
        >
          <option value="all">All file types</option>
          {Object.entries(LIBRARY_FILE_TYPE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <LoadingState label="Loading library..." />
      ) : filteredFiles.length === 0 ? (
        <EmptyState icon={LibraryIcon} title="No files found" description="Try adjusting your search or filters." />
      ) : (
        <TableContainer>
          <TableHead>
            <Th>File</Th>
            <Th>Type</Th>
            <Th>Subject / Course</Th>
            <Th>Uploaded By</Th>
            <Th>Size</Th>
            <Th>Version</Th>
            <Th>Date</Th>
            <Th className="text-right">Actions</Th>
          </TableHead>
          <TableBody>
            {filteredFiles.map((file) => (
              <Tr key={file.id}>
                <Td>
                  <div className="flex items-start gap-2">
                    <FileText className="mt-0.5 size-4 shrink-0 text-brand-500" />
                    <div>
                      <p className="font-medium text-slate-800">{file.title}</p>
                      <p className="max-w-xs truncate text-xs text-slate-400">{file.description}</p>
                    </div>
                  </div>
                </Td>
                <Td>
                  <Badge tone="brand">{LIBRARY_FILE_TYPE_LABELS[file.fileType]}</Badge>
                </Td>
                <Td>
                  {file.subject} · {file.course}
                </Td>
                <Td>
                  <p className="text-slate-700">{file.uploadedByName}</p>
                  <p className="text-xs text-slate-400 capitalize">{file.uploadedByRole}</p>
                </Td>
                <Td>{formatFileSize(file.fileSizeKb)}</Td>
                <Td>v{file.version}</Td>
                <Td>{formatDate(file.uploadDate)}</Td>
                <Td className="text-right">
                  <RowActionsMenu
                    actions={[
                      { label: "Download", icon: Download, onClick: () => window.open(file.fileUrl, "_blank") },
                      {
                        label: "Edit Details",
                        icon: Pencil,
                        onClick: () => {
                          setEditingFile(file);
                          setFormKey((k) => k + 1);
                          setFormOpen(true);
                        },
                      },
                      { label: "Delete", icon: Trash2, danger: true, onClick: () => setDeleteTarget(file) },
                    ]}
                  />
                </Td>
              </Tr>
            ))}
          </TableBody>
        </TableContainer>
      )}

      <LibraryFileModal key={formKey} open={formOpen} file={editingFile} tuitions={tuitions} onClose={() => setFormOpen(false)} onSubmit={handleCreateOrUpdate} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete File"
        message={`"${deleteTarget?.title}" will be permanently removed from the library. This action cannot be undone. (Only Admins can permanently delete files — teachers may only replace their own uploads.)`}
        confirmLabel="Delete"
        tone="danger"
        isLoading={isActionLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
