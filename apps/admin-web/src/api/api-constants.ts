// Placeholder API configuration. Values are read from env vars so that
// swapping mock repositories for real HTTP repositories later requires
// no code changes here — only a .env update and a deployment.
export const API_CONSTANTS = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.example-lms.com/v1",
  TIMEOUT_MS: 15000,
  TOKEN_STORAGE_KEY: "lms_admin_access_token",
  REFRESH_TOKEN_STORAGE_KEY: "lms_admin_refresh_token",
};
