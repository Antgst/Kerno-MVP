function getDefaultApiBaseUrl() {
  const hostname =
    typeof window !== "undefined" && window.location?.hostname
      ? window.location.hostname
      : "localhost";

  return `http://${hostname}:5000/api`;
}

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || getDefaultApiBaseUrl();
