import { API_BASE_URL } from "../config/api";
import ApiError from "./apiError";
import { clearSessionCache } from "./frontendCache";
import { getAuthToken } from "./tokenStorage";

function removeTrailingSlash(value) {
  return value.replace(/\/+$/, "");
}

function normalizePath(path) {
  return path.startsWith("/") ? path : `/${path}`;
}

function buildUrl(path, query) {
  const url = `${removeTrailingSlash(API_BASE_URL)}${normalizePath(path)}`;

  if (!query) {
    return url;
  }

  const searchParams = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value);
    }
  });

  const queryString = searchParams.toString();

  return queryString ? `${url}?${queryString}` : url;
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");

  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    if (response.status === 401) {
      clearSessionCache();
    }

    const message =
      typeof data === "object" && data?.message
        ? data.message
        : "La requête vers l’API a échoué";

    throw new ApiError(message, response.status, data);
  }

  return data;
}

export async function apiRequest(path, options = {}) {
  const {
    method = "GET",
    body,
    query,
    headers = {},
    token = getAuthToken(),
    ...fetchOptions
  } = options;

  const requestHeaders = {
    Accept: "application/json",
    ...headers,
  };

  if (body !== undefined) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(buildUrl(path, query), {
      method,
      headers: requestHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...fetchOptions,
    });

    return await parseResponse(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError("Impossible de joindre le serveur API", 0, {
      originalMessage: error.message,
    });
  }
}

const apiClient = {
  get(path, options) {
    return apiRequest(path, {
      method: "GET",
      ...options,
    });
  },

  post(path, body, options) {
    return apiRequest(path, {
      method: "POST",
      body,
      ...options,
    });
  },

  put(path, body, options) {
    return apiRequest(path, {
      method: "PUT",
      body,
      ...options,
    });
  },

  patch(path, body, options) {
    return apiRequest(path, {
      method: "PATCH",
      body,
      ...options,
    });
  },

  delete(path, options) {
    return apiRequest(path, {
      method: "DELETE",
      ...options,
    });
  },
};

export default apiClient;
