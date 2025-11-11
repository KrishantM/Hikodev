import { useMemo } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { HikeMap } from "@/lib/map";
import { useAuth } from "@/lib/auth/client";
import { useHike, useHikeRouteGeoJson, useTrackAlerts, useUserProfile, useWeather } from "@/lib/hooks";
import { StatusChip } from "@/components/StatusChip";
import { setSavedHike } from "@/lib/services/users";

export default function HikeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: hike, isLoading } = useHike(id);
  const { data: geojson } = useHikeRouteGeoJson(id);
  const { data: weather } = useWeather(id, hike ? hike.start : undefined);
  const { data: alerts } = useTrackAlerts(hike?.id);
  const { data: profile } = useUserProfile(user?.uid);

  const saved = useMemo(() => {
    if (!hike) return false;
    return profile?.savedHikes?.includes(hike.id) ?? false;
  }, [profile?.savedHikes, hike]);

  const toggleSave = useMutation({
    mutationFn: (shouldSave: boolean) => {
      if (!user || !hike) return Promise.resolve();
      return setSavedHike(user.uid, hike.id, shouldSave);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile", user?.uid] });
    },
  });

  const weatherDays = useMemo(() => weather ?? [], [weather]);
  const topAlerts = useMemo(() => (alerts || []).slice(0, 3), [alerts]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#02685A" />
      </View>
    );
  }

  if (!hike) {
    return (
      <View style={styles.centered}>
        <Ionicons name="trail-sign" size={40} color="#9E9E9E" />
        <Text style={styles.errorText}>We couldn't find that hike.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>{hike.name}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.saveButton, saved && styles.saveButtonActive]}
            onPress={() => toggleSave.mutate(!saved)}
            disabled={toggleSave.isPending || !user}
          >
            <Ionicons
              name={saved ? "bookmark" : "bookmark-outline"}
              size={18}
              color={saved ? "#fff" : "#02685A"}
            />
          </TouchableOpacity>
          <StatusChip status={hike.statusSummary ?? "unknown"} />
        </View>
      </View>
      <Text style={styles.subtitle}>{hike.region}</Text>
      <View style={styles.metaRow}>
        <View style={styles.metaPill}>
          <Ionicons name="map-outline" size={16} color="#02685A" />
          <Text style={styles.metaText}>{hike.distanceKm.toFixed(1)} km</Text>
        </View>
        {hike.elevationGainM && (
          <View style={styles.metaPill}>
            <Ionicons name="trending-up" size={16} color="#02685A" />
            <Text style={styles.metaText}>+{hike.elevationGainM} m</Text>
          </View>
        )}
        {hike.difficulty && (
          <View style={styles.metaPill}>
            <Ionicons name="barbell-outline" size={16} color="#02685A" />
            <Text style={styles.metaText}>{hike.difficulty}</Text>
          </View>
        )}
        <View style={styles.metaPill}>
          <Ionicons
            name={hike.overnight ? "moon" : "sunny"}
            size={16}
            color="#02685A"
          />
          <Text style={styles.metaText}>{hike.overnight ? "Overnight" : "Day"}</Text>
        </View>
      </View>

      <HikeMap coordinates={hike.start} geojson={geojson ?? undefined} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3-day forecast</Text>
        {weatherDays.length === 0 ? (
          <Text style={styles.emptyCopy}>Weather data will appear after the next sync.</Text>
        ) : (
          weatherDays.map((day) => (
            <View key={day.date} style={styles.weatherCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.weatherDate}>{new Date(day.date).toDateString()}</Text>
                <Text style={styles.weatherSummary}>{day.summary}</Text>
              </View>
              <View style={styles.weatherMeta}>
                <Text style={styles.weatherTemp}>{Math.round(day.tempMax)}° / {Math.round(day.tempMin)}°</Text>
                {day.windKph ? (
                  <Text style={styles.weatherMetaText}>{Math.round(day.windKph)} km/h</Text>
                ) : null}
                {day.precipMm ? (
                  <Text style={styles.weatherMetaText}>{day.precipMm.toFixed(1)} mm</Text>
                ) : null}
                <Text style={styles.weatherProvider}>via {day.provider}</Text>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DOC alerts</Text>
        {topAlerts.length === 0 ? (
          <Text style={styles.emptyCopy}>No recent alerts for this track.</Text>
        ) : (
          topAlerts.map((alert) => (
            <View key={alert.id} style={styles.alertCard}>
              <Text style={styles.alertTitle}>{alert.title}</Text>
              <Text style={styles.alertBody}>{alert.body}</Text>
              <Text style={styles.alertMeta}>
                Updated {alert.updatedAt.toLocaleDateString()} • {alert.severity ?? "info"}
              </Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tags & features</Text>
        <View style={styles.tagRow}>
          {hike.tags.map((tag) => (
            <View key={tag} style={styles.tagChip}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {hike.features.map((feature) => (
            <View key={feature} style={styles.tagChipMuted}>
              <Text style={styles.tagTextMuted}>{feature}</Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => router.push({ pathname: "/plan", params: { hikeId: hike.id } })}
      >
        <Ionicons name="trail-sign" size={18} color="#fff" />
        <Text style={styles.primaryButtonText}>Plan this hike</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#024C3F",
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "#607D8B",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  saveButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#02685A",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  saveButtonActive: {
    backgroundColor: "#02685A",
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  metaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#E0F2F1",
  },
  metaText: {
    color: "#02685A",
    fontWeight: "600",
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#024C3F",
  },
  emptyCopy: {
    color: "#607D8B",
    fontStyle: "italic",
  },
  weatherCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  weatherDate: {
    fontSize: 15,
    fontWeight: "600",
    color: "#024C3F",
  },
  weatherSummary: {
    color: "#607D8B",
  },
  weatherMeta: {
    alignItems: "flex-end",
    gap: 4,
  },
  weatherTemp: {
    fontSize: 16,
    fontWeight: "700",
    color: "#02685A",
  },
  weatherMetaText: {
    fontSize: 12,
    color: "#607D8B",
  },
  weatherProvider: {
    fontSize: 10,
    color: "#90A4AE",
    textTransform: "uppercase",
  },
  alertCard: {
    backgroundColor: "#FFF3E0",
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#BF360C",
  },
  alertBody: {
    fontSize: 13,
    color: "#5D4037",
  },
  alertMeta: {
    fontSize: 11,
    color: "#8D6E63",
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#E8F5E9",
    borderRadius: 999,
  },
  tagChipMuted: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#ECEFF1",
    borderRadius: 999,
  },
  tagText: {
    color: "#2E7D32",
    fontWeight: "600",
  },
  tagTextMuted: {
    color: "#546E7A",
    fontWeight: "600",
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#02685A",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  errorText: {
    fontSize: 16,
    color: "#607D8B",
  },
});
