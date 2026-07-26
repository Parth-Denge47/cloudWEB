import { AnnouncementRepository, AnnouncementFilters } from "@/domain/repositories/announcement.repository";
import { mockAnnouncementRepository } from "@/data/repositories/mock-announcement.repository";
import { Announcement, AnnouncementInput } from "@/domain/models/announcement.model";

// Service layer for Announcements, including platform-wide broadcasts.
export class AnnouncementService {
  constructor(private readonly repository: AnnouncementRepository = mockAnnouncementRepository) {}

  getAll(filters?: AnnouncementFilters): Promise<Announcement[]> {
    return this.repository.getAll(filters);
  }

  create(input: AnnouncementInput): Promise<Announcement> {
    return this.repository.create(input);
  }

  update(id: string, changes: Partial<AnnouncementInput>): Promise<Announcement> {
    return this.repository.update(id, changes);
  }

  delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}

export const announcementService = new AnnouncementService();
