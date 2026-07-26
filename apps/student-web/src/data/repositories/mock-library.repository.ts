import { LibraryRepository, LibraryFilters } from "@/domain/repositories/library.repository";
import { LibraryFile } from "@/domain/models/library-file.model";
import { libraryFiles } from "@/data/mock/seed-data";
import { mockDelay } from "@/data/mock/delay";

export class MockLibraryRepository implements LibraryRepository {
  async getAll(filters?: LibraryFilters): Promise<LibraryFile[]> {
    await mockDelay();
    let result = [...libraryFiles];
    if (filters?.tuitionId) result = result.filter((f) => f.tuitionId === filters.tuitionId);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((f) => f.title.toLowerCase().includes(q));
    }
    return result.sort((a, b) => (a.uploadDate < b.uploadDate ? 1 : -1));
  }
}

export const mockLibraryRepository = new MockLibraryRepository();
