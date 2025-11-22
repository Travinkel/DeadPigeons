import { ApiClient } from "./generated/api-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5155";

export function createApiClient(token?: string | null): ApiClient {
  const customFetch = {
    fetch: (url: string, init?: globalThis.RequestInit): Promise<Response> => {
      const headers = new Headers(init?.headers);

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return fetch(url, {
        ...init,
        headers,
      });
    },
  };

  return new ApiClient(API_URL, customFetch);
}
