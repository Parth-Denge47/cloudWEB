import { LectureRepository, LectureFilters } from "@/domain/repositories/lecture.repository";
import { VideoLecture, VideoLectureInput, VideoLectureModel } from "@/domain/models/video-lecture.model";
import { videoLectures } from "@/data/mock/seed-data";
import { mockDelay, nextId } from "@/data/mock/delay";

// Mock implementation of LectureRepository (unlisted YouTube links only).
export class MockLectureRepository implements LectureRepository {
  async getAll(filters?: LectureFilters): Promise<VideoLecture[]> {
    await mockDelay();
    let result = [...videoLectures];
    if (filters?.tuitionId) result = result.filter((l) => l.tuitionId === filters.tuitionId);
    if (filters?.subject) result = result.filter((l) => l.subject === filters.subject);
    if (filters?.course) result = result.filter((l) => l.course === filters.course);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((l) => l.title.toLowerCase().includes(q));
    }
    return result.sort((a, b) => (a.uploadDate < b.uploadDate ? 1 : -1));
  }

  async getById(id: string): Promise<VideoLecture | null> {
    await mockDelay(150);
    return videoLectures.find((l) => l.id === id) ?? null;
  }

  async create(input: VideoLectureInput): Promise<VideoLecture> {
    await mockDelay();
    if (!VideoLectureModel.extractVideoId(input.youtubeUnlistedUrl)) {
      throw new Error("Enter a valid YouTube link.");
    }
    const created: VideoLecture = VideoLectureModel.fromJson({
      ...input,
      id: nextId("lec"),
      uploadDate: new Date().toISOString(),
    });
    videoLectures.unshift(created);
    return created;
  }

  async update(id: string, changes: Partial<VideoLectureInput>): Promise<VideoLecture> {
    await mockDelay();
    const index = videoLectures.findIndex((l) => l.id === id);
    if (index === -1) throw new Error("Lecture not found.");
    const updated = VideoLectureModel.copyWith(videoLectures[index], changes);
    videoLectures[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<void> {
    await mockDelay();
    const index = videoLectures.findIndex((l) => l.id === id);
    if (index === -1) throw new Error("Lecture not found.");
    videoLectures.splice(index, 1);
  }
}

export const mockLectureRepository = new MockLectureRepository();
