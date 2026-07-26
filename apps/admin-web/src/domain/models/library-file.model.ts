import { LibraryFileType, UploaderRole } from "./enums";

// Library file entity (PDF/Notes/Book/Assignment/etc).
// Delete is admin-only by policy — teachers may only replace/update their
// own uploads. This rule is enforced in the repository/service layer so
// the UI never has to duplicate the permission check.
export interface LibraryFile {
  id: string;
  title: string;
  description: string;
  subject: string;
  course: string;
  tuitionId: string;
  fileType: LibraryFileType;
  fileSizeKb: number;
  tags: string[];
  version: number;
  uploadedByName: string;
  uploadedByRole: UploaderRole;
  uploadedById: string;
  uploadDate: string; // ISO date string
  fileUrl: string; // placeholder — will resolve to a signed R2/S3 URL
}

export type LibraryFileInput = Omit<LibraryFile, "id" | "uploadDate" | "version">;

export const LibraryFileModel = {
  fromJson(json: Record<string, unknown>): LibraryFile {
    return {
      id: String(json.id),
      title: String(json.title),
      description: String(json.description),
      subject: String(json.subject),
      course: String(json.course),
      tuitionId: String(json.tuitionId),
      fileType: json.fileType as LibraryFileType,
      fileSizeKb: Number(json.fileSizeKb),
      tags: Array.isArray(json.tags) ? (json.tags as string[]) : [],
      version: Number(json.version),
      uploadedByName: String(json.uploadedByName),
      uploadedByRole: json.uploadedByRole as UploaderRole,
      uploadedById: String(json.uploadedById),
      uploadDate: String(json.uploadDate),
      fileUrl: String(json.fileUrl),
    };
  },
  toJson(file: LibraryFile): Record<string, unknown> {
    return { ...file };
  },
  copyWith(file: LibraryFile, changes: Partial<LibraryFile>): LibraryFile {
    return { ...file, ...changes };
  },
  equals(a: LibraryFile, b: LibraryFile): boolean {
    return a.id === b.id;
  },
};
