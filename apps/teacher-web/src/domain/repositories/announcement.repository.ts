import { Announcement, AnnouncementInput } from "@/domain/models/announcement.model";

export interface AnnouncementFilters {
  tuitionId?: string;
  createdById?: string;
}

// Repository abstraction for Announcements scoped to a teacher's tuition.
export interface AnnouncementRepository {
  getAll(filters?: AnnouncementFilters): Promise<Announcement[]>;
  create(input: AnnouncementInput): Promise<Announcement>;
  update(id: string, changes: Partial<AnnouncementInput>): Promise<Announcement>;
  delete(id: string): Promise<void>;
}
