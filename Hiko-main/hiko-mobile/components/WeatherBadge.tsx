import { memo } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useWeather } from "@/lib/hooks";

interface WeatherBadgeProps {
  hikeId: string;
  lat: number;
  lng: number;
}

function WeatherBadgeComponent({ hikeId, lat, lng }: WeatherBadgeProps) {
  const { data, isLoading } = useWeather(hikeId, { lat, lng });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#02685A" />
      </View>
    );
  }

  const today = data?.[0];
  if (!today) {
    return (
      <View style={styles.container}>
        <Ionicons name="cloud-outline" size={14} color="#616161" />
        <Text style={styles.text}>Weather unavailable</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Ionicons name="cloud-outline" size={14} color="#02685A" />
      <Text style={styles.text}>{Math.round(today.tempMax)}° / {Math.round(today.tempMin)}°</Text>
      <Text style={styles.provider}>{today.provider}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#E0F2F1",
    borderRadius: 999,
  },
  text: {
    fontSize: 12,
    color: "#02685A",
    fontWeight: "600",
  },
  provider: {
    fontSize: 10,
    color: "#02685A",
    textTransform: "uppercase",
  },
});

export const WeatherBadge = memo(WeatherBadgeComponent);
