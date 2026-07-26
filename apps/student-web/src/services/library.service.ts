import { LibraryRepository, LibraryFilters } from "@/domain/repositories/library.repository";
import { mockLibraryRepository } from "@/data/repositories/mock-library.repository";
import { LibraryFile } from "@/domain/models/library-file.model";

export class LibraryService {
  constructor(private readonly repository: LibraryRepository = mockLibraryRepository) {}
  getAll(filters?: LibraryFilters): Promise<LibraryFile[]> {
    return this.repository.getAll(filters);
  }
}

export const libraryService = new LibraryService();
