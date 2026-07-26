import { LibraryFile, LibraryFileInput } from "@/domain/models/library-file.model";

export interface LibraryFilters {
  tuitionId?: string;
  uploadedById?: string;
  search?: string;
}

// Repository abstraction for Library content. Per the permission matrix,
// teachers may upload and edit/replace their OWN uploads but never
// hard-delete — there is deliberately no `delete` method here.
export interface LibraryRepository {
  getAll(filters?: LibraryFilters): Promise<LibraryFile[]>;
  upload(input: LibraryFileInput): Promise<LibraryFile>;
  update(id: string, changes: Partial<LibraryFileInput>): Promise<LibraryFile>;
}
