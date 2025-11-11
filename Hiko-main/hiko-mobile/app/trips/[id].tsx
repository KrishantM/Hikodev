import { useEffect, useMemo } from "react";
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

import { HikeMap } from "@/lib/map";
import { useTrip, useHike, useWeather, useTrackAlerts, useHikeRouteGeoJson } from "@/lib/hooks";
import { isTripOfflineReady, saveTripOfflineCache } from "@/lib/storage/offline";

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: trip, isLoading } = useTrip(id);
  const { data: hike } = useHike(trip?.hikeId);
  const { data: weather } = useWeather(trip?.hikeId, hike ? hike.start : undefined);
  const { data: alerts } = useTrackAlerts(hike?.id);
  const { data: geojson } = useHikeRouteGeoJson(hike?.id);

  useEffect(() => {
    if (trip && hike) {
      saveTripOfflineCache(trip, hike, {
        routeGeoJson: geojson ?? undefined,
        weather: weather ?? undefined,
      });
    }
  }, [trip, hike, geojson, weather]);

  const offline = useMemo(() => (trip ? isTripOfflineReady(trip.id) : false), [trip]);
  const sortedAlerts = useMemo(() => (alerts || []).slice(0, 3), [alerts]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#02685A" />
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={styles.centered}>
        <Ionicons name="trail-sign" size={44} color="#90A4AE" />
        <Text style={styles.message}>Trip not found.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace("/plan")}>
          <Text style={styles.primaryButtonText}>Plan a trip</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{trip.title}</Text>
        {offline && (
          <View style={styles.offlineBadge}>
            <Ionicons name="cloud-download" size={14} color="#2E7D32" />
            <Text style={styles.offlineText}>Offline ready</Text>
          </View>
        )}
      </View>
      <Text style={styles.date}>
        {trip.startDate.toLocaleDateString()} – {trip.endDate.toLocaleDateString()}
      </Text>

      {hike && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hike</Text>
          <Text style={styles.sectionBody}>{hike.name}</Text>
          <Text style={styles.sectionMeta}>
            {hike.region} • {hike.distanceKm.toFixed(1)} km • {hike.difficulty ?? "unknown"}
          </Text>
          <HikeMap coordinates={hike.start} geojson={geojson ?? undefined} />
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Participants</Text>
        <View style={styles.chipRow}>
          {[trip.createdBy, ...trip.participants].map((participant) => (
            <View key={participant} style={styles.chip}>
              <Text style={styles.chipText}>{participant}</Text>
            </View>
          ))}
        </View>
      </View>

      {weather && weather.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3-day forecast</Text>
          {weather.map((day) => (
            <View key={day.date} style={styles.weatherCard}>
              <Text style={styles.weatherDate}>{new Date(day.date).toDateString()}</Text>
              <Text style={styles.weatherTemp}>{Math.round(day.tempMax)}° / {Math.round(day.tempMin)}°</Text>
              <Text style={styles.weatherMeta}>
                {day.summary} • {day.provider}
              </Text>
            </View>
          ))}
        </View>
      )}

      {sortedAlerts.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DOC alerts</Text>
          {sortedAlerts.map((alert) => (
            <View key={alert.id} style={styles.alertCard}>
              <Text style={styles.alertTitle}>{alert.title}</Text>
              <Text style={styles.alertBody}>{alert.body}</Text>
              <Text style={styles.alertMeta}>Updated {alert.updatedAt.toLocaleDateString()}</Text>
            </View>
          ))}
        </View>
      )}

      {trip.gearNeeded.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gear checklist</Text>
          {trip.gearNeeded.map((item) => (
            <View key={item} style={styles.gearRow}>
              <Ionicons name="checkmark-circle-outline" size={18} color="#90A4AE" />
              <Text style={styles.gearText}>{item}</Text>
            </View>
          ))}
        </View>
      )}
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
    paddingHorizontal: 32,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#024C3F",
    flex: 1,
  },
  date: {
    fontSize: 15,
    color: "#607D8B",
  },
  offlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#E8F5E9",
  },
  offlineText: {
    color: "#2E7D32",
    fontWeight: "600",
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#024C3F",
  },
  sectionBody: {
    fontSize: 16,
    color: "#37474F",
  },
  sectionMeta: {
    fontSize: 12,
    color: "#90A4AE",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: "#E0F2F1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  chipText: {
    color: "#02685A",
    fontWeight: "600",
  },
  weatherCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    gap: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  weatherDate: {
    fontWeight: "700",
    color: "#024C3F",
  },
  weatherTemp: {
    color: "#02685A",
    fontWeight: "600",
  },
  weatherMeta: {
    color: "#607D8B",
    fontSize: 12,
  },
  alertCard: {
    backgroundColor: "#FFF3E0",
    borderRadius: 12,
    padding: 16,
    gap: 6,
  },
  alertTitle: {
    fontWeight: "700",
    color: "#BF360C",
  },
  alertBody: {
    color: "#5D4037",
  },
  alertMeta: {
    color: "#8D6E63",
    fontSize: 12,
  },
  gearRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  gearText: {
    color: "#455A64",
  },
  primaryButton: {
    backgroundColor: "#02685A",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  message: {
    color: "#607D8B",
    fontSize: 16,
    textAlign: "center",
  },
});
