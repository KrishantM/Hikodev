import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { tripService } from "@/lib/services/trip-service";
import { hikeService } from "@/lib/services/hike-service";
import { weatherService } from "@/lib/services/weather-service";

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: trip, isLoading } = useQuery({
    queryKey: ["trip", id],
    queryFn: () => tripService.getTrip(id!),
    enabled: !!id,
  });

  const { data: hike } = useQuery({
    queryKey: ["hike", trip?.hikeId],
    queryFn: () => (trip?.hikeId ? hikeService.getHike(trip.hikeId) : null),
    enabled: !!trip?.hikeId,
  });

  const { data: weather } = useQuery({
    queryKey: ["weather", trip?.hikeId],
    queryFn: () =>
      hike
        ? weatherService.getForecast(
            hike.id,
            hike.startLatLng.lat,
            hike.startLatLng.lng
          )
        : Promise.resolve([]),
    enabled: !!hike,
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading trip...</Text>
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Trip not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{trip.title}</Text>
      <Text style={styles.date}>
        {new Date(trip.startDate).toLocaleDateString()} -{" "}
        {new Date(trip.endDate).toLocaleDateString()}
      </Text>

      {hike && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hike: {hike.name}</Text>
          <Text style={styles.sectionText}>{hike.region} • {hike.distanceKm} km</Text>
        </View>
      )}

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
            </View>
          ))}
        </View>
      )}

      {trip.gearNeeded && trip.gearNeeded.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gear Checklist</Text>
          {trip.gearNeeded.map((gear, index) => (
            <View key={index} style={styles.gearItem}>
              <Text style={styles.gearText}>• {gear}</Text>
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
  date: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#02685A",
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: "#666",
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
  },
  gearItem: {
    paddingVertical: 8,
  },
  gearText: {
    fontSize: 14,
    color: "#666",
  },
  error: {
    fontSize: 16,
    color: "#d32f2f",
    textAlign: "center",
    marginTop: 40,
  },
});

