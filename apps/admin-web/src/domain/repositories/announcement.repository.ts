import { Announcement, AnnouncementInput } from "@/domain/models/announcement.model";

export interface AnnouncementFilters {
  tuitionId?: string;
  search?: string;
}

// Repository abstraction for Announcements, including broadcast (all
// tuitions) creation.
export interface AnnouncementRepository {
  getAll(filters?: AnnouncementFilters): Promise<Announcement[]>;
  create(input: AnnouncementInput): Promise<Announcement>;
  update(id: string, changes: Partial<AnnouncementInput>): Promise<Announcement>;
  delete(id: string): Promise<void>;
}
