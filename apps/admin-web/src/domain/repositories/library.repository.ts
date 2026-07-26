import { LibraryFile, LibraryFileInput } from "@/domain/models/library-file.model";

export interface LibraryFilters {
  tuitionId?: string;
  fileType?: LibraryFile["fileType"];
  subject?: string;
  course?: string;
  search?: string;
}

// Repository abstraction for Library content.
// Permission rule (enforced here, not just in the UI): only admin-role
// callers may hard-delete a file. Teachers may only replace/update their
// own uploads via `update`.
export interface LibraryRepository {
  getAll(filters?: LibraryFilters): Promise<LibraryFile[]>;
  getById(id: string): Promise<LibraryFile | null>;
  upload(input: LibraryFileInput): Promise<LibraryFile>;
  update(id: string, changes: Partial<LibraryFileInput>): Promise<LibraryFile>;
  delete(id: string): Promise<void>;
}
