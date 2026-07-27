import apiClient from "./apiClient";

export function getCurrentUser() {
  return apiClient.get("/users/me");
}
