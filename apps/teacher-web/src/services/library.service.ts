import { LibraryRepository, LibraryFilters } from "@/domain/repositories/library.repository";
import { mockLibraryRepository } from "@/data/repositories/mock-library.repository";
import { LibraryFile, LibraryFileInput } from "@/domain/models/library-file.model";

export class LibraryService {
  constructor(private readonly repository: LibraryRepository = mockLibraryRepository) {}
  getAll(filters?: LibraryFilters): Promise<LibraryFile[]> {
    return this.repository.getAll(filters);
  }
  upload(input: LibraryFileInput): Promise<LibraryFile> {
    return this.repository.upload(input);
  }
  update(id: string, changes: Partial<LibraryFileInput>): Promise<LibraryFile> {
    return this.repository.update(id, changes);
  }
}

export const libraryService = new LibraryService();
