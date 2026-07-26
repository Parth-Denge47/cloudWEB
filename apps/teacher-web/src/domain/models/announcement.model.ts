import { AnnouncementAudience, UploaderRole } from "./enums";

// Announcement entity. Admin announcements can broadcast across every
// tuition; teacher announcements are scoped to their own tuition/students.
export interface Announcement {
  id: string;
  title: string;
  message: string;
  tuitionId: string | null; // null when broadcast to all tuitions
  audience: AnnouncementAudience;
  createdByName: string;
  createdByRole: UploaderRole;
  isBroadcast: boolean;
  createdAt: string; // ISO date string
}

export type AnnouncementInput = Omit<Announcement, "id" | "createdAt">;

export const AnnouncementModel = {
  fromJson(json: Record<string, unknown>): Announcement {
    return {
      id: String(json.id),
      title: String(json.title),
      message: String(json.message),
      tuitionId: (json.tuitionId as string) ?? null,
      audience: json.audience as AnnouncementAudience,
      createdByName: String(json.createdByName),
      createdByRole: json.createdByRole as UploaderRole,
      isBroadcast: Boolean(json.isBroadcast),
      createdAt: String(json.createdAt),
    };
  },
  toJson(announcement: Announcement): Record<string, unknown> {
    return { ...announcement };
  },
  copyWith(announcement: Announcement, changes: Partial<Announcement>): Announcement {
    return { ...announcement, ...changes };
  },
  equals(a: Announcement, b: Announcement): boolean {
    return a.id === b.id;
  },
};
