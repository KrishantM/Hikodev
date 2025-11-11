import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
  dehydrate,
  type DehydratedState,
} from "@tanstack/react-query";
import {
  createMMKVPersister,
  type PersistedClient,
  type QueryPersister,
} from "@/lib/storage/queryPersister";

const CACHE_BUSTER = "v1";
const DEFAULT_MAX_AGE = 24 * 60 * 60 * 1000;

type PersistOptions = {
  persister: QueryPersister;
  maxAge?: number;
  buster?: string;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnReconnect: true,
    },
  },
});

const persister = createMMKVPersister();

export default function RootLayout() {
  const [persistOptions] = useState<PersistOptions>(() => ({
    persister,
    buster: CACHE_BUSTER,
    maxAge: DEFAULT_MAX_AGE,
  }));

  const content = (
    <SafeAreaProvider>
      <PersistedQueryProvider client={queryClient} persistOptions={persistOptions}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: "#02685A" },
            headerTintColor: "#fff", 
            headerTitleStyle: { fontWeight: "bold" },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="hikes/[id]" options={{ title: "Hike Details" }} />
          <Stack.Screen name="trips/[id]" options={{ title: "Trip" }} />
          <Stack.Screen name="plan" options={{ title: "Plan Trip" }} />
          <Stack.Screen
            name="auth/signin"
            options={{ title: "Sign In", presentation: "modal" }}
          />
        </Stack>
      </PersistedQueryProvider>
    </SafeAreaProvider>
  );

  if (Platform.OS === "web") {
    return content;
  }

  return <GestureHandlerRootView style={{ flex: 1 }}>{content}</GestureHandlerRootView>;
}

type PersistedState = DehydratedState | undefined;

type PersistSubscription = () => void;

function PersistedQueryProvider({
  client,
  persistOptions,
  children,
}: {
  client: QueryClient;
  persistOptions: PersistOptions;
  children: ReactNode;
}) {
  const { persister, maxAge = DEFAULT_MAX_AGE, buster = CACHE_BUSTER } = persistOptions;
  const [hydratedState, setHydratedState] = useState<PersistedState>(undefined);
  const [isRestored, setIsRestored] = useState(false);

  useEffect(() => {
    let unsubscribes: PersistSubscription[] = [];
    let persistTimeout: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const persist = () => {
      if (persistTimeout) {
        clearTimeout(persistTimeout);
      }
      persistTimeout = setTimeout(() => {
        const payload: PersistedClient = {
          timestamp: Date.now(),
          buster,
          clientState: dehydrate(client),
        };
        persister.persistClient(payload).catch((error) => {
          console.warn("Failed to persist query cache", error);
        });
      }, 200);
    };

    const restore = async () => {
      try {
        const restored = await persister.restoreClient();
        if (!restored) return;
        const isExpired = Date.now() - restored.timestamp > maxAge;
        if (restored.buster !== buster || isExpired) {
          await persister.removeClient();
          return;
        }
        if (!cancelled) {
          setHydratedState(restored.clientState);
        }
      } catch (error) {
        console.warn("Failed to restore query cache", error);
        await persister.removeClient().catch(() => undefined);
      }
    };

    restore()
      .catch((error) => {
        console.warn("Unexpected error during query cache restore", error);
      })
      .finally(() => {
        if (!cancelled) {
          setIsRestored(true);
          unsubscribes = [
            client.getQueryCache().subscribe(persist),
            client.getMutationCache().subscribe(persist),
          ];
          persist();
        }
      });

    return () => {
      cancelled = true;
      unsubscribes.forEach((unsubscribe) => unsubscribe());
      if (persistTimeout) {
        clearTimeout(persistTimeout);
      }
    };
  }, [client, persister, maxAge, buster]);

  if (!isRestored) {
    return null;
  }

  return (
    <QueryClientProvider client={client}>
      <Hydrate state={hydratedState}>{children}</Hydrate>
    </QueryClientProvider>
  );
}
