import { getRoleFromToken } from "../utils/jwt";

const AUTH_TOKEN_STORAGE_KEY = "kerno_auth_token";
const AUTH_ROLE_STORAGE_KEY = "kerno_auth_role";

export function getAuthToken() {
  try {
    return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token) {
  try {
    if (!token) {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      return;
    }

    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  } catch (error) {
    void error;
  }
}

export function getAuthRole() {
  try {
    const storedRole = localStorage.getItem(AUTH_ROLE_STORAGE_KEY);

    if (storedRole) {
      return storedRole;
    }

    return getRoleFromToken(getAuthToken());
  } catch {
    return getRoleFromToken(getAuthToken());
  }
}

export function setAuthRole(role) {
  try {
    if (!role) {
      localStorage.removeItem(AUTH_ROLE_STORAGE_KEY);
      return;
    }

    localStorage.setItem(AUTH_ROLE_STORAGE_KEY, String(role).toUpperCase());
  } catch (error) {
    void error;
  }
}

export function clearAuthToken() {
  try {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    localStorage.removeItem(AUTH_ROLE_STORAGE_KEY);
  } catch (error) {
    void error;
  }
}
