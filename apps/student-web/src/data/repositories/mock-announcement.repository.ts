import { AnnouncementRepository, AnnouncementFilters } from "@/domain/repositories/announcement.repository";
import { Announcement } from "@/domain/models/announcement.model";
import { announcements } from "@/data/mock/seed-data";
import { mockDelay } from "@/data/mock/delay";

export class MockAnnouncementRepository implements AnnouncementRepository {
  async getAll(filters?: AnnouncementFilters): Promise<Announcement[]> {
    await mockDelay();
    let result = [...announcements].filter((a) => a.audience === "all" || a.audience === "students");
    if (filters?.tuitionId) result = result.filter((a) => a.tuitionId === filters.tuitionId || a.isBroadcast);
    return result.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }
}

export const mockAnnouncementRepository = new MockAnnouncementRepository();
