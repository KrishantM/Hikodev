import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: false,
          },
        },
      })
  );

  const content = (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: "#02685A",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="hikes/[id]"
            options={{ title: "Hike Details" }}
          />
          <Stack.Screen name="trips/[id]" options={{ title: "Trip" }} />
          <Stack.Screen name="plan" options={{ title: "Plan Trip" }} />
          <Stack.Screen
            name="auth/signin"
            options={{ title: "Sign In", presentation: "modal" }}
          />
        </Stack>
      </QueryClientProvider>
    </SafeAreaProvider>
  );

  // GestureHandlerRootView doesn't work well on web
  if (Platform.OS === "web") {
    return content;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {content}
    </GestureHandlerRootView>
  );
}
