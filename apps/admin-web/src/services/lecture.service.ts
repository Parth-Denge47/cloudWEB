import { LectureRepository, LectureFilters } from "@/domain/repositories/lecture.repository";
import { mockLectureRepository } from "@/data/repositories/mock-lecture.repository";
import { VideoLecture, VideoLectureInput } from "@/domain/models/video-lecture.model";

// Service layer for Video Lectures (unlisted YouTube links only).
export class LectureService {
  constructor(private readonly repository: LectureRepository = mockLectureRepository) {}

  getAll(filters?: LectureFilters): Promise<VideoLecture[]> {
    return this.repository.getAll(filters);
  }

  getById(id: string): Promise<VideoLecture | null> {
    return this.repository.getById(id);
  }

  create(input: VideoLectureInput): Promise<VideoLecture> {
    return this.repository.create(input);
  }

  update(id: string, changes: Partial<VideoLectureInput>): Promise<VideoLecture> {
    return this.repository.update(id, changes);
  }

  delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}

export const lectureService = new LectureService();
