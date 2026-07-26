import { UploaderRole } from "./enums";

// Video lecture entity. Only unlisted YouTube links are supported per
// spec — students only ever see the embedded player, never the raw
// YouTube app/recommendations.
export interface VideoLecture {
  id: string;
  title: string;
  description: string;
  subject: string;
  course: string;
  tuitionId: string;
  youtubeUnlistedUrl: string;
  durationMinutes: number;
  uploadedByName: string;
  uploadedByRole: UploaderRole;
  uploadDate: string; // ISO date string
}

export type VideoLectureInput = Omit<VideoLecture, "id" | "uploadDate">;

export const VideoLectureModel = {
  fromJson(json: Record<string, unknown>): VideoLecture {
    return {
      id: String(json.id),
      title: String(json.title),
      description: String(json.description),
      subject: String(json.subject),
      course: String(json.course),
      tuitionId: String(json.tuitionId),
      youtubeUnlistedUrl: String(json.youtubeUnlistedUrl),
      durationMinutes: Number(json.durationMinutes),
      uploadedByName: String(json.uploadedByName),
      uploadedByRole: json.uploadedByRole as UploaderRole,
      uploadDate: String(json.uploadDate),
    };
  },
  toJson(lecture: VideoLecture): Record<string, unknown> {
    return { ...lecture };
  },
  copyWith(lecture: VideoLecture, changes: Partial<VideoLecture>): VideoLecture {
    return { ...lecture, ...changes };
  },
  equals(a: VideoLecture, b: VideoLecture): boolean {
    return a.id === b.id;
  },

  // Extracts a YouTube video ID from common unlisted-link formats so the
  // presentation layer can build an embed URL without repeating regex.
  extractVideoId(url: string): string | null {
    const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  },
};
