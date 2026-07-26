import { LibraryRepository, LibraryFilters } from "@/domain/repositories/library.repository";
import { LibraryFile, LibraryFileInput, LibraryFileModel } from "@/domain/models/library-file.model";
import { libraryFiles } from "@/data/mock/seed-data";
import { mockDelay, nextId } from "@/data/mock/delay";

// Mock implementation of LibraryRepository for the Teacher panel.
// Deliberately has no delete — per the permission matrix, teachers may
// only upload and replace/update their own files.
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
    if (libraryFiles[index].uploadedByRole !== "teacher") {
      throw new Error("Teachers may only edit files they uploaded themselves.");
    }
    const bumpsVersion = changes.fileUrl !== undefined;
    const updated = LibraryFileModel.copyWith(libraryFiles[index], {
      ...changes,
      version: bumpsVersion ? libraryFiles[index].version + 1 : libraryFiles[index].version,
    });
    libraryFiles[index] = updated;
    return updated;
  }
}

export const mockLibraryRepository = new MockLibraryRepository();
