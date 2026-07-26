import { LectureRepository, LectureFilters } from "@/domain/repositories/lecture.repository";
import { mockLectureRepository } from "@/data/repositories/mock-lecture.repository";
import { VideoLecture, VideoLectureInput } from "@/domain/models/video-lecture.model";

export class LectureService {
  constructor(private readonly repository: LectureRepository = mockLectureRepository) {}
  getAll(filters?: LectureFilters): Promise<VideoLecture[]> {
    return this.repository.getAll(filters);
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
