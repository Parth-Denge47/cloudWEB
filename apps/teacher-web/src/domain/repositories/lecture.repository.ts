import { VideoLecture, VideoLectureInput } from "@/domain/models/video-lecture.model";

export interface LectureFilters {
  tuitionId?: string;
  uploadedById?: string;
  search?: string;
}

// Repository abstraction for Video Lectures (unlisted YouTube links only).
export interface LectureRepository {
  getAll(filters?: LectureFilters): Promise<VideoLecture[]>;
  create(input: VideoLectureInput): Promise<VideoLecture>;
  update(id: string, changes: Partial<VideoLectureInput>): Promise<VideoLecture>;
  delete(id: string): Promise<void>;
}
