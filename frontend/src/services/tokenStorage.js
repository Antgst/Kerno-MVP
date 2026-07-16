const AUTH_TOKEN_STORAGE_KEY = "kerno_auth_token";
const AUTH_ROLE_STORAGE_KEY = "kerno_auth_role";

function getBrowserLocalStorage() {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return null;
    }

    return window.localStorage;
  } catch {
    return null;
  }
}

function removeLegacyAuthValue(key) {
  const storage = getBrowserLocalStorage();

  if (!storage) {
    return;
  }

  try {
    storage.removeItem(key);
  } catch (error) {
    void error;
  }
}

export function clearAuthToken() {
  removeLegacyAuthValue(AUTH_TOKEN_STORAGE_KEY);
  removeLegacyAuthValue(AUTH_ROLE_STORAGE_KEY);
}
