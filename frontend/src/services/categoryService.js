import apiClient from "./apiClient";
import {
  CACHE_KEYS,
  getSessionCache,
  removeSessionCache,
  setSessionCache,
} from "./frontendCache";

const CATEGORY_CACHE_TTL_MS = 10 * 60 * 1000;

function getCachedCategoriesResponse() {
  const cachedCategories = getSessionCache(CACHE_KEYS.CATEGORIES);

  if (
    !cachedCategories ||
    !cachedCategories.expiresAt ||
    cachedCategories.expiresAt <= Date.now()
  ) {
    removeSessionCache(CACHE_KEYS.CATEGORIES);
    return null;
  }

  return cachedCategories.response ?? null;
}

export async function getCategories() {
  const cachedResponse = getCachedCategoriesResponse();

  if (cachedResponse) {
    return cachedResponse;
  }

  const response = await apiClient.get("/categories");

  setSessionCache(CACHE_KEYS.CATEGORIES, {
    response,
    expiresAt: Date.now() + CATEGORY_CACHE_TTL_MS,
  });

  return response;
}
