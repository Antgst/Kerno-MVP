const AUTH_TOKEN_STORAGE_KEY = "kerno_auth_token";

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
  } catch {
    // Token persistence is optional for now.
  }
}

export function clearAuthToken() {
  try {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  } catch {
    // Nothing to clear if localStorage is unavailable.
  }
}
