import { VideoLecture, VideoLectureInput } from "@/domain/models/video-lecture.model";

export interface LectureFilters {
  tuitionId?: string;
  subject?: string;
  course?: string;
  search?: string;
}

// Repository abstraction for Video Lectures (unlisted YouTube links only).
export interface LectureRepository {
  getAll(filters?: LectureFilters): Promise<VideoLecture[]>;
  getById(id: string): Promise<VideoLecture | null>;
  create(input: VideoLectureInput): Promise<VideoLecture>;
  update(id: string, changes: Partial<VideoLectureInput>): Promise<VideoLecture>;
  delete(id: string): Promise<void>;
}
