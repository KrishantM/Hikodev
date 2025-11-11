import { logger } from "firebase-functions";

import {
  DOC_COORDINATES_SYSTEM,
  DOC_DEFAULT_PAGE_SIZE,
  getDocApiKey,
  getDocBaseUrl,
} from "./config";

export interface FetchOptions {
  query?: Record<string, string | number | boolean | undefined>;
  pageSize?: number;
  signal?: AbortSignal;
}

const MAX_RETRIES = 5;
const BASE_DELAY_MS = 500;

function buildUrl(path: string, options?: FetchOptions, page?: number) {
  const base = getDocBaseUrl();
  const url = new URL(`${base}${path}`);
  const params = new URLSearchParams();
  params.set("coordinates", DOC_COORDINATES_SYSTEM);
  params.set("pageSize", String(options?.pageSize ?? DOC_DEFAULT_PAGE_SIZE));
  if (page) {
    params.set("page", String(page));
  }
  if (options?.query) {
    for (const [key, value] of Object.entries(options.query)) {
      if (value === undefined || value === null) continue;
      params.set(key, String(value));
    }
  }
  url.search = params.toString();
  return url;
}

async function fetchWithRetry(url: URL, options?: FetchOptions): Promise<any> {
  const headers = {
    "x-api-key": getDocApiKey(),
    Accept: "application/json",
  };

  let attempt = 0;
  while (attempt < MAX_RETRIES) {
    attempt += 1;
    const response = await fetch(url, {
      headers,
      signal: options?.signal,
    });

    if (response.status === 429) {
      const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
      logger.warn(
        `DOC API rate limited (${response.status}). Retrying in ${delay}ms (attempt ${attempt}/${MAX_RETRIES}).`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      continue;
    }

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `DOC API request failed with ${response.status} ${response.statusText}: ${body}`
      );
    }

    return response.json();
  }

  throw new Error("DOC API request exceeded retry limit");
}

function extractItems<T>(payload: any): T[] {
  if (!payload) {
    return [];
  }
  if (Array.isArray(payload)) {
    return payload as T[];
  }
  if (Array.isArray(payload.items)) {
    return payload.items as T[];
  }
  if (Array.isArray(payload.data)) {
    return payload.data as T[];
  }
  return [];
}

function hasNextPage(payload: any, fetched: number, expectedPageSize: number) {
  if (!payload) return false;
  if (typeof payload.nextPage === "number") {
    return payload.nextPage > 0;
  }
  if (typeof payload.nextPageToken === "string") {
    return payload.nextPageToken.length > 0;
  }
  if (payload.pagination?.next) {
    return true;
  }
  return fetched >= expectedPageSize;
}

export async function fetchAll<T = any>(
  path: string,
  options?: FetchOptions
): Promise<T[]> {
  const items: T[] = [];
  let page = 1;
  const pageSize = options?.pageSize ?? DOC_DEFAULT_PAGE_SIZE;

  while (true) {
    const url = buildUrl(path, options, page);
    const payload = await fetchWithRetry(url, options);
    const pageItems = extractItems<T>(payload);

    items.push(...pageItems);

    if (!hasNextPage(payload, pageItems.length, pageSize)) {
      break;
    }

    page += 1;
  }

  return items;
}

export async function fetchSingle<T = any>(
  path: string,
  options?: FetchOptions
): Promise<T | null> {
  const url = buildUrl(path, options);
  const payload = await fetchWithRetry(url, options);
  if (!payload) return null;
  if (payload.item) {
    return payload.item as T;
  }
  if (payload.data) {
    if (Array.isArray(payload.data)) {
      return (payload.data[0] as T) ?? null;
    }
    return payload.data as T;
  }
  return payload as T;
}
