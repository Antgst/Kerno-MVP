import apiClient from "./apiClient";

export function createStoreProfile(payload) {
  return apiClient.post("/stores/profile", payload);
}

export function getCurrentStoreProfile() {
  return apiClient.get("/stores/profile/me");
}

export function updateCurrentStoreProfile(payload) {
  return apiClient.put("/stores/profile/me", payload);
}

const storeService = {
  createStoreProfile,
  getCurrentStoreProfile,
  updateCurrentStoreProfile,
};

export default storeService;
