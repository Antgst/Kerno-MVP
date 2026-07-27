import apiClient from "./apiClient";
import {
  clearSessionCache,
  getCachedCurrentUser,
  setCachedCurrentUser,
} from "./frontendCache";
import { clearAuthToken } from "./tokenStorage";
import { getResource } from "../utils/responseUtils";

function getUserFromResponse(response) {
  return getResource(response, ["user"]);
}

function getRoleFromUser(user) {
  return user?.role || null;
}

function persistAuthResponse(response) {
  const user = getUserFromResponse(response);
  const role = getRoleFromUser(user);

  clearAuthToken();
  setCachedCurrentUser(user);

  return {
    ...response,
    user,
    role,
  };
}

export async function registerUser(payload) {
  const response = await apiClient.post("/auth/register", payload);

  return persistAuthResponse(response);
}

export async function loginUser(payload) {
  const response = await apiClient.post("/auth/login", payload);

  return persistAuthResponse(response);
}

export async function logoutUser() {
  try {
    await apiClient.post("/auth/logout");
  } catch (error) {
    void error;
  } finally {
    clearAuthToken();
    clearSessionCache();
  }
}

export async function getCurrentSessionUser({ forceRefresh = false } = {}) {
  clearAuthToken();

  const cachedUser = getCachedCurrentUser();

  if (cachedUser && !forceRefresh) {
    return cachedUser;
  }

  try {
    const response = await apiClient.get("/users/me");
    const user = getUserFromResponse(response);

    setCachedCurrentUser(user);

    return user;
  } catch (error) {
    clearSessionCache();
    throw error;
  }
}

export function getCurrentAuthRole() {
  return getRoleFromUser(getCachedCurrentUser());
}

export function isAuthenticated() {
  return Boolean(getCachedCurrentUser());
}
