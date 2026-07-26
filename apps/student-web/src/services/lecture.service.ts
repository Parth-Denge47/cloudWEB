import { LectureRepository, LectureFilters } from "@/domain/repositories/lecture.repository";
import { mockLectureRepository } from "@/data/repositories/mock-lecture.repository";
import { VideoLecture } from "@/domain/models/video-lecture.model";

export class LectureService {
  constructor(private readonly repository: LectureRepository = mockLectureRepository) {}
  getAll(filters?: LectureFilters): Promise<VideoLecture[]> {
    return this.repository.getAll(filters);
  }
}

export const lectureService = new LectureService();
