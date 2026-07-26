import { LibraryRepository, LibraryFilters } from "@/domain/repositories/library.repository";
import { LibraryFile, LibraryFileInput, LibraryFileModel } from "@/domain/models/library-file.model";
import { libraryFiles } from "@/data/mock/seed-data";
import { mockDelay, nextId } from "@/data/mock/delay";

// Mock implementation of LibraryRepository. The Admin panel always calls
// `delete` with admin privileges, so hard-delete is unconditionally
// available here — the Teacher panel's repository implementation is
// expected to omit/reject delete entirely per the permission matrix.
export class MockLibraryRepository implements LibraryRepository {
  async getAll(filters?: LibraryFilters): Promise<LibraryFile[]> {
    await mockDelay();
    let result = [...libraryFiles];
    if (filters?.tuitionId) result = result.filter((f) => f.tuitionId === filters.tuitionId);
    if (filters?.fileType) result = result.filter((f) => f.fileType === filters.fileType);
    if (filters?.subject) result = result.filter((f) => f.subject === filters.subject);
    if (filters?.course) result = result.filter((f) => f.course === filters.course);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (f) => f.title.toLowerCase().includes(q) || f.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return result.sort((a, b) => (a.uploadDate < b.uploadDate ? 1 : -1));
  }

  async getById(id: string): Promise<LibraryFile | null> {
    await mockDelay(150);
    return libraryFiles.find((f) => f.id === id) ?? null;
  }

  async upload(input: LibraryFileInput): Promise<LibraryFile> {
    await mockDelay();
    const created: LibraryFile = LibraryFileModel.fromJson({
      ...input,
      id: nextId("lib"),
      version: 1,
      uploadDate: new Date().toISOString(),
    });
    libraryFiles.unshift(created);
    return created;
  }

  async update(id: string, changes: Partial<LibraryFileInput>): Promise<LibraryFile> {
    await mockDelay();
    const index = libraryFiles.findIndex((f) => f.id === id);
    if (index === -1) throw new Error("File not found.");
    const bumpsVersion = changes.fileUrl !== undefined;
    const updated = LibraryFileModel.copyWith(libraryFiles[index], {
      ...changes,
      version: bumpsVersion ? libraryFiles[index].version + 1 : libraryFiles[index].version,
    });
    libraryFiles[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<void> {
    await mockDelay();
    const index = libraryFiles.findIndex((f) => f.id === id);
    if (index === -1) throw new Error("File not found.");
    libraryFiles.splice(index, 1);
  }
}

export const mockLibraryRepository = new MockLibraryRepository();
