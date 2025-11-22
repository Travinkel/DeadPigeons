import { ApiClient } from "./generated/api-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function createApiClient(token?: string | null): ApiClient {
  const customFetch = {
    fetch: (url: globalThis.RequestInfo, init?: globalThis.RequestInit): Promise<Response> => {
      // NSwag passes headers as a plain object, so we need to merge properly
      const existingHeaders = init?.headers as Record<string, string> | undefined;
      const headers: Record<string, string> = {
        ...existingHeaders,
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      return fetch(url, {
        ...init,
        headers,
      });
    },
  };

  return new ApiClient(API_URL, customFetch);
}
