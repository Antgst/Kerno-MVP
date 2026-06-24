import apiClient from "./apiClient";

export function getSuppliers(query) {
  return apiClient.get("/suppliers", { query });
}

export function getSupplierById(id) {
  return apiClient.get(`/suppliers/${id}`);
}

export function createSupplierProfile(payload) {
  return apiClient.post("/suppliers/profile", payload);
}

export function getCurrentSupplierProfile() {
  return apiClient.get("/suppliers/profile/me");
}

export function updateCurrentSupplierProfile(payload) {
  return apiClient.put("/suppliers/profile/me", payload);
}
