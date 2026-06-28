import axios from "axios";

const normalizeBaseUrl = (url: string) => url.replace(/\/+$/, "");

export const apiOrigin = import.meta.env.VITE_API_URL
  ? normalizeBaseUrl(import.meta.env.VITE_API_URL)
  : "";

const apiBaseUrl = apiOrigin ? `${apiOrigin}/api` : "/api";

export const resolveApiAssetUrl = (url: string | undefined) => {
  if (!url) {
    return url;
  }

  if (url.startsWith("/renders/")) {
    return apiOrigin ? `${apiOrigin}${url}` : url;
  }

  if (apiOrigin && url.startsWith("http")) {
    try {
      const parsed = new URL(url);
      if (parsed.pathname.startsWith("/renders/")) {
        return `${apiOrigin}${parsed.pathname}${parsed.search}`;
      }
    } catch {
      return url;
    }
  }

  return url;
};

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Request failed";

    return Promise.reject(new Error(message));
  }
);
