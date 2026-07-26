import { API_CONSTANTS } from "./api-constants";
import { NetworkException, UnauthorizedException, ApiException, NotFoundException } from "./api-exceptions";

// Thin fetch wrapper standing in for a future Dio/axios-based client.
// Not called by any mock repository today — it exists so that HTTP
// repository implementations can be dropped in later without inventing
// a client from scratch.
//
// TODO (Backend): attach the bearer token from secure storage once
// authentication is implemented, and wire refresh-token retry logic.
class ApiClient {
  private baseUrl = API_CONSTANTS.BASE_URL;

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}${path}`, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          ...init.headers,
        },
      });
    } catch {
      throw new NetworkException();
    }

    if (response.status === 401) throw new UnauthorizedException();
    if (response.status === 404) throw new NotFoundException();
    if (!response.ok) {
      throw new ApiException(`Request failed with status ${response.status}`, response.status);
    }

    return (await response.json()) as T;
  }

  get<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: "GET" });
  }

  post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined });
  }

  patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined });
  }

  delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
