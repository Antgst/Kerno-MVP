import apiClient from "./apiClient";
import { clearAuthToken, setAuthToken } from "./tokenStorage";

export async function registerUser(payload) {
  const response = await apiClient.post("/auth/register", payload);

  if (response?.token) {
    setAuthToken(response.token);
  }

  return response;
}

export async function loginUser(payload) {
  const response = await apiClient.post("/auth/login", payload);

  if (response?.token) {
    setAuthToken(response.token);
  }

  return response;
}

export function logoutUser() {
  clearAuthToken();
}

const authService = {
  registerUser,
  loginUser,
  logoutUser,
};

export default authService;
