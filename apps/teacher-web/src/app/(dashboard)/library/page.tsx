"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Download, Library as LibraryIcon, FileText } from "lucide-react";
import { PageHeader } from "@/presentation/components/ui/PageHeader";
import { Button } from "@/presentation/components/ui/Button";
import { SearchInput } from "@/presentation/components/ui/SearchInput";
import { Badge } from "@/presentation/components/ui/Badge";
import { TableContainer, TableHead, Th, TableBody, Tr, Td } from "@/presentation/components/ui/Table";
import { LoadingState } from "@/presentation/components/ui/LoadingState";
import { EmptyState } from "@/presentation/components/ui/EmptyState";
import { RowActionsMenu } from "@/presentation/components/ui/RowActionsMenu";
import { LibraryFileModal } from "@/presentation/components/library/LibraryFileModal";
import { useAuth } from "@/state/auth-context";
import { libraryService } from "@/services/library.service";
import { LibraryFile, LibraryFileInput } from "@/domain/models/library-file.model";
import { LIBRARY_FILE_TYPE_LABELS } from "@/domain/models/enums";
import { formatDate, formatFileSize } from "@/utils/format";

export default function LibraryPage() {
  const { teacher } = useAuth();
  const [files, setFiles] = useState<LibraryFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [editingFile, setEditingFile] = useState<LibraryFile | null>(null);

  useEffect(() => {
    if (!teacher) return;
    void (async () => {
      setIsLoading(true);
      const result = await libraryService.getAll({ tuitionId: teacher.tuitionId });
      setFiles(result);
      setIsLoading(false);
    })();
  }, [teacher]);

  const filteredFiles = useMemo(
    () => files.filter((f) => !search || f.title.toLowerCase().includes(search.toLowerCase())),
    [files, search]
  );

  if (!teacher) return <LoadingState />;

  async function handleCreateOrUpdate(input: LibraryFileInput) {
    if (editingFile) {
      const updated = await libraryService.update(editingFile.id, input);
      setFiles((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
    } else {
      const created = await libraryService.upload(input);
      setFiles((prev) => [created, ...prev]);
    }
  }

  return (
    <div>
      <PageHeader
        title="Library"
        description="Upload notes, books, PDFs, and assignments for your tuition. You can replace your own files, but only Admin can permanently delete."
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

      <SearchInput value={search} onChange={setSearch} placeholder="Search files" className="mb-4 max-w-xs" />

      {isLoading ? (
        <LoadingState label="Loading library..." />
      ) : filteredFiles.length === 0 ? (
        <EmptyState icon={LibraryIcon} title="No files found" description="Upload your first file to get started." />
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
                      ...(file.uploadedById === teacher.id
                        ? [
                            {
                              label: "Edit / Replace",
                              icon: Pencil,
                              onClick: () => {
                                setEditingFile(file);
                                setFormKey((k) => k + 1);
                                setFormOpen(true);
                              },
                            },
                          ]
                        : []),
                    ]}
                  />
                </Td>
              </Tr>
            ))}
          </TableBody>
        </TableContainer>
      )}

      <LibraryFileModal key={formKey} open={formOpen} file={editingFile} teacher={teacher} onClose={() => setFormOpen(false)} onSubmit={handleCreateOrUpdate} />
    </div>
  );
}
