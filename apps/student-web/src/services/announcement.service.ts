import { AnnouncementRepository, AnnouncementFilters } from "@/domain/repositories/announcement.repository";
import { mockAnnouncementRepository } from "@/data/repositories/mock-announcement.repository";
import { Announcement } from "@/domain/models/announcement.model";

export class AnnouncementService {
  constructor(private readonly repository: AnnouncementRepository = mockAnnouncementRepository) {}
  getAll(filters?: AnnouncementFilters): Promise<Announcement[]> {
    return this.repository.getAll(filters);
  }
}

export const announcementService = new AnnouncementService();
