import { LibraryRepository, LibraryFilters } from "@/domain/repositories/library.repository";
import { mockLibraryRepository } from "@/data/repositories/mock-library.repository";
import { LibraryFile, LibraryFileInput } from "@/domain/models/library-file.model";

// Service layer for Library content (Notes/Books/PDFs/Assignments/etc).
export class LibraryService {
  constructor(private readonly repository: LibraryRepository = mockLibraryRepository) {}

  getAll(filters?: LibraryFilters): Promise<LibraryFile[]> {
    return this.repository.getAll(filters);
  }

  getById(id: string): Promise<LibraryFile | null> {
    return this.repository.getById(id);
  }

  upload(input: LibraryFileInput): Promise<LibraryFile> {
    return this.repository.upload(input);
  }

  update(id: string, changes: Partial<LibraryFileInput>): Promise<LibraryFile> {
    return this.repository.update(id, changes);
  }

  // Admin-only per the permission matrix — the Teacher panel's service
  // must not expose this method.
  delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}

export const libraryService = new LibraryService();
