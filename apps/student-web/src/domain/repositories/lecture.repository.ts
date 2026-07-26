import { VideoLecture } from "@/domain/models/video-lecture.model";

export interface LectureFilters {
  tuitionId?: string;
  search?: string;
}

// Read-only for students — they can watch embedded lectures only.
export interface LectureRepository {
  getAll(filters?: LectureFilters): Promise<VideoLecture[]>;
}
