const CACHE_PREFIX = "kerno:";

export const CACHE_KEYS = {
  CURRENT_USER: `${CACHE_PREFIX}current_user`,
  CATEGORIES: `${CACHE_PREFIX}categories`,
};

function getSessionStorage() {
  try {
    if (typeof window === "undefined" || !window.sessionStorage) {
      return null;
    }

    return window.sessionStorage;
  } catch {
    return null;
  }
}

function isKernoCacheKey(key) {
  return String(key || "").startsWith(CACHE_PREFIX);
}

export function getSessionCache(key) {
  const storage = getSessionStorage();

  if (!storage || !key) {
    return null;
  }

  try {
    const cachedValue = storage.getItem(key);

    if (!cachedValue) {
      return null;
    }

    return JSON.parse(cachedValue);
  } catch {
    try {
      storage.removeItem(key);
    } catch (error) {
      void error;
    }

    return null;
  }
}

export function setSessionCache(key, value) {
  const storage = getSessionStorage();

  if (!storage || !key) {
    return;
  }

  try {
    if (value === null || value === undefined) {
      storage.removeItem(key);
      return;
    }

    storage.setItem(key, JSON.stringify(value));
  } catch (error) {
    void error;
  }
}

export function removeSessionCache(key) {
  const storage = getSessionStorage();

  if (!storage || !key) {
    return;
  }

  try {
    storage.removeItem(key);
  } catch (error) {
    void error;
  }
}

export function clearSessionCache() {
  const storage = getSessionStorage();

  if (!storage) {
    return;
  }

  try {
    for (const key of Object.keys(storage)) {
      if (isKernoCacheKey(key)) {
        storage.removeItem(key);
      }
    }
  } catch (error) {
    void error;
  }
}

export function getCachedCurrentUser() {
  return getSessionCache(CACHE_KEYS.CURRENT_USER);
}

export function setCachedCurrentUser(user) {
  setSessionCache(CACHE_KEYS.CURRENT_USER, user);
}
