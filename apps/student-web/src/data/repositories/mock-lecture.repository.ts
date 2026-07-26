import { LectureRepository, LectureFilters } from "@/domain/repositories/lecture.repository";
import { VideoLecture } from "@/domain/models/video-lecture.model";
import { videoLectures } from "@/data/mock/seed-data";
import { mockDelay } from "@/data/mock/delay";

export class MockLectureRepository implements LectureRepository {
  async getAll(filters?: LectureFilters): Promise<VideoLecture[]> {
    await mockDelay();
    let result = [...videoLectures];
    if (filters?.tuitionId) result = result.filter((l) => l.tuitionId === filters.tuitionId);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((l) => l.title.toLowerCase().includes(q));
    }
    return result.sort((a, b) => (a.uploadDate < b.uploadDate ? 1 : -1));
  }
}

export const mockLectureRepository = new MockLectureRepository();
