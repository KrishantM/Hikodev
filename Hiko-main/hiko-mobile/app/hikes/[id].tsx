import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { hikeService } from "@/lib/services/hike-service";
import { weatherService } from "@/lib/services/weather-service";
import { docService } from "@/lib/services/doc-service";

export default function HikeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: hike, isLoading } = useQuery({
    queryKey: ["hike", id],
    queryFn: () => hikeService.getHike(id!),
    enabled: !!id,
  });

  const { data: weather } = useQuery({
    queryKey: ["weather", id],
    queryFn: () =>
      hike
        ? weatherService.getForecast(
            id!,
            hike.startLatLng.lat,
            hike.startLatLng.lng
          )
        : Promise.resolve([]),
    enabled: !!hike,
  });

  const { data: docStatus } = useQuery({
    queryKey: ["docStatus", hike?.docTrackId],
    queryFn: () =>
      hike?.docTrackId
        ? docService.getTrackStatus(hike.docTrackId)
        : Promise.resolve(null),
    enabled: !!hike?.docTrackId,
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading hike details...</Text>
      </View>
    );
  }

  if (!hike) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Hike not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{hike.name}</Text>
      <Text style={styles.region}>{hike.region}</Text>
      
      <View style={styles.infoRow}>
        <Text style={styles.info}>{hike.distanceKm} km</Text>
        {hike.elevationGainM && (
          <Text style={styles.info}>+{hike.elevationGainM}m</Text>
        )}
        <Text style={styles.difficulty}>
          {hike.difficulty.charAt(0).toUpperCase() + hike.difficulty.slice(1)}
        </Text>
      </View>

      {weather && weather.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weather Forecast</Text>
          {weather.map((forecast, index) => (
            <View key={index} style={styles.weatherItem}>
              <Text style={styles.weatherDate}>
                {index === 0
                  ? "Today"
                  : index === 1
                  ? "Tomorrow"
                  : forecast.date.toLocaleDateString()}
              </Text>
              <Text style={styles.weatherTemp}>
                {Math.round(forecast.tempMax)}° / {Math.round(forecast.tempMin)}°
              </Text>
              <Text style={styles.weatherDesc}>{forecast.description}</Text>
            </View>
          ))}
        </View>
      )}

      {docStatus && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Track Status</Text>
          <Text style={styles.statusText}>{docStatus.summary}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#02685A",
    marginBottom: 8,
  },
  region: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  info: {
    fontSize: 16,
    color: "#02685A",
    fontWeight: "500",
  },
  difficulty: {
    fontSize: 16,
    color: "#666",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#02685A",
    marginBottom: 12,
  },
  weatherItem: {
    padding: 12,
    backgroundColor: "#F5F1E8",
    borderRadius: 8,
    marginBottom: 8,
  },
  weatherDate: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  weatherTemp: {
    fontSize: 14,
    color: "#02685A",
    marginBottom: 4,
  },
  weatherDesc: {
    fontSize: 14,
    color: "#666",
  },
  statusText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  error: {
    fontSize: 16,
    color: "#d32f2f",
    textAlign: "center",
    marginTop: 40,
  },
});

