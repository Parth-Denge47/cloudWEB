import { AnnouncementRepository, AnnouncementFilters } from "@/domain/repositories/announcement.repository";
import { Announcement, AnnouncementInput, AnnouncementModel } from "@/domain/models/announcement.model";
import { announcements } from "@/data/mock/seed-data";
import { mockDelay, nextId } from "@/data/mock/delay";

export class MockAnnouncementRepository implements AnnouncementRepository {
  async getAll(filters?: AnnouncementFilters): Promise<Announcement[]> {
    await mockDelay();
    let result = [...announcements];
    if (filters?.tuitionId) {
      result = result.filter((a) => a.tuitionId === filters.tuitionId || a.isBroadcast);
    }
    return result.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  async create(input: AnnouncementInput): Promise<Announcement> {
    await mockDelay();
    const created: Announcement = AnnouncementModel.fromJson({
      ...input,
      id: nextId("ann"),
      isBroadcast: false, // teachers cannot broadcast platform-wide, only admins
      createdAt: new Date().toISOString(),
    });
    announcements.unshift(created);
    return created;
  }

  async update(id: string, changes: Partial<AnnouncementInput>): Promise<Announcement> {
    await mockDelay();
    const index = announcements.findIndex((a) => a.id === id);
    if (index === -1) throw new Error("Announcement not found.");
    const updated = AnnouncementModel.copyWith(announcements[index], changes);
    announcements[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<void> {
    await mockDelay();
    const index = announcements.findIndex((a) => a.id === id);
    if (index === -1) throw new Error("Announcement not found.");
    announcements.splice(index, 1);
  }
}

export const mockAnnouncementRepository = new MockAnnouncementRepository();
