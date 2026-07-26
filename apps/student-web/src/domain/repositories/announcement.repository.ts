import { Announcement } from "@/domain/models/announcement.model";

export interface AnnouncementFilters {
  tuitionId?: string;
}

// Read-only for students.
export interface AnnouncementRepository {
  getAll(filters?: AnnouncementFilters): Promise<Announcement[]>;
}
