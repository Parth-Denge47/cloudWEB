import { LibraryFile } from "@/domain/models/library-file.model";

export interface LibraryFilters {
  tuitionId?: string;
  search?: string;
}

// Read-only for students — they can view/search/download but never
// upload, edit, or delete, per the permission matrix.
export interface LibraryRepository {
  getAll(filters?: LibraryFilters): Promise<LibraryFile[]>;
}
