"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Library as LibraryIcon, FileText } from "lucide-react";
import { PageHeader } from "@/presentation/components/ui/PageHeader";
import { SearchInput } from "@/presentation/components/ui/SearchInput";
import { Badge } from "@/presentation/components/ui/Badge";
import { TableContainer, TableHead, Th, TableBody, Tr, Td } from "@/presentation/components/ui/Table";
import { LoadingState } from "@/presentation/components/ui/LoadingState";
import { EmptyState } from "@/presentation/components/ui/EmptyState";
import { Button } from "@/presentation/components/ui/Button";
import { useAuth } from "@/state/auth-context";
import { libraryService } from "@/services/library.service";
import { LibraryFile } from "@/domain/models/library-file.model";
import { LIBRARY_FILE_TYPE_LABELS, LibraryFileType } from "@/domain/models/enums";
import { formatDate, formatFileSize } from "@/utils/format";

// Students can only view/search/filter/download — no upload, edit, or
// delete, per the permission matrix.
export default function LibraryPage() {
  const { student } = useAuth();
  const [files, setFiles] = useState<LibraryFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | LibraryFileType>("all");

  useEffect(() => {
    if (!student) return;
    void (async () => {
      setIsLoading(true);
      const result = await libraryService.getAll({ tuitionId: student.tuitionId });
      setFiles(result);
      setIsLoading(false);
    })();
  }, [student]);

  const filteredFiles = useMemo(() => {
    return files.filter((f) => {
      const matchesSearch = !search || f.title.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || f.fileType === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [files, search, typeFilter]);

  return (
    <div>
      <PageHeader title="Library" description="Notes, books, PDFs, and assignments shared by your teachers." />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search files" className="max-w-xs" />
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
        <EmptyState icon={LibraryIcon} title="No files found" />
      ) : (
        <TableContainer>
          <TableHead>
            <Th>File</Th>
            <Th>Type</Th>
            <Th>Subject</Th>
            <Th>Size</Th>
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
                <Td>{file.subject}</Td>
                <Td>{formatFileSize(file.fileSizeKb)}</Td>
                <Td>{formatDate(file.uploadDate)}</Td>
                <Td className="text-right">
                  <Button size="sm" variant="outline" onClick={() => window.open(file.fileUrl, "_blank")}>
                    <Download className="size-3.5" /> Download
                  </Button>
                </Td>
              </Tr>
            ))}
          </TableBody>
        </TableContainer>
      )}
    </div>
  );
}
