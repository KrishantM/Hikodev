import type { DehydratedState } from "@tanstack/react-query";

import { getString, removeItem, setItem } from "./mmkv";

const QUERY_CACHE_KEY = "react-query-cache";

export type PersistedClient = {
  timestamp: number;
  buster: string;
  clientState: DehydratedState;
};

export type QueryPersister = {
  persistClient: (client: PersistedClient) => Promise<void>;
  restoreClient: () => Promise<PersistedClient | undefined>;
  removeClient: () => Promise<void>;
};

export function createMMKVPersister(key: string = QUERY_CACHE_KEY): QueryPersister {
  return {
    persistClient: async (client: PersistedClient) => {
      setItem(key, JSON.stringify(client));
    },
    restoreClient: async () => {
      const stored = getString(key);
      if (!stored) return undefined;
      try {
        return JSON.parse(stored) as PersistedClient;
      } catch (error) {
        console.warn("Failed to parse persisted query client", error);
        removeItem(key);
        return undefined;
      }
    },
    removeClient: async () => {
      removeItem(key);
    },
  };
}
