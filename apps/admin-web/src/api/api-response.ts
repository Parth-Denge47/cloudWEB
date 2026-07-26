// Envelope every service method resolves to, mirroring the shape the
// NestJS backend will eventually return. Keeping this consistent now
// means UI code written against mocks won't need to change later.
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export function apiSuccess<T>(data: T, message?: string): ApiResponse<T> {
  return { data, success: true, message };
}
