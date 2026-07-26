// Authenticated admin identity, returned by AuthRepository.login().
export interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: "super_admin" | "admin";
}

export const AdminUserModel = {
  fromJson(json: Record<string, unknown>): AdminUser {
    return {
      id: String(json.id),
      username: String(json.username),
      name: String(json.name),
      email: String(json.email),
      role: json.role as AdminUser["role"],
    };
  },
  toJson(user: AdminUser): Record<string, unknown> {
    return { ...user };
  },
  equals(a: AdminUser, b: AdminUser): boolean {
    return a.id === b.id;
  },
};
