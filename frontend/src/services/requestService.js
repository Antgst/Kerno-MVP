import apiClient from "./apiClient";

export function createContactRequest(payload) {
  return apiClient.post("/requests", payload);
}

export function getSentRequests() {
  return apiClient.get("/requests/sent");
}

export function getReceivedRequests() {
  return apiClient.get("/requests/received");
}

export function getRequestById(id) {
  return apiClient.get(`/requests/${id}`);
}

export function updateRequestStatus(id, payload) {
  return apiClient.patch(`/requests/${id}/status`, payload);
}

const requestService = {
  createContactRequest,
  getSentRequests,
  getReceivedRequests,
  getRequestById,
  updateRequestStatus,
};

export default requestService;
