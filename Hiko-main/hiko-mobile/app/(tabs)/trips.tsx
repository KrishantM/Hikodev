import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useAuth } from "@/lib/auth/client";
import { useTrips } from "@/lib/hooks";
import type { Trip } from "@/lib/types";

function isUpcomingTrip(trip: Trip) {
  const now = new Date();
  return trip.status === "planning" || trip.status === "active" || trip.startDate > now;
}

export default function TripsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  const { data: trips = [], isLoading } = useTrips(user?.uid);

  const { upcomingTrips, pastTrips } = useMemo(() => {
    const upcoming: Trip[] = [];
    const past: Trip[] = [];
    trips.forEach((trip) => {
      if (isUpcomingTrip(trip)) {
        upcoming.push(trip);
      } else {
        past.push(trip);
      }
    });
    return { upcomingTrips: upcoming, pastTrips: past };
  }, [trips]);

  if (!user) {
    return (
      <View style={styles.centered}>
        <Ionicons name="trail-sign" size={48} color="#90A4AE" />
        <Text style={styles.message}>Sign in to see your trips.</Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("/auth/signin")}
        >
          <Text style={styles.primaryButtonText}>Sign in</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#02685A" />
      </View>
    );
  }

  const data = tab === "upcoming" ? upcomingTrips : pastTrips;

  const renderTrip = ({ item }: { item: Trip }) => (
    <TouchableOpacity
      onPress={() => router.push(`/trips/${item.id}`)}
      style={styles.card}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.tripTitle}>{item.title}</Text>
        <View style={[styles.statusBadge, styles[`status_${item.status}` as const]]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.tripDate}>
        {item.startDate.toLocaleDateString()} – {item.endDate.toLocaleDateString()}
      </Text>
      <Text style={styles.tripMeta}>Participants: {item.participants.length}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Trips</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push("/plan")}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.primaryButtonText}>Plan trip</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabButton, tab === "upcoming" && styles.tabActive]}
          onPress={() => setTab("upcoming")}
        >
          <Text style={[styles.tabText, tab === "upcoming" && styles.tabTextActive]}>Upcoming</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, tab === "past" && styles.tabActive]}
          onPress={() => setTab("past")}
        >
          <Text style={[styles.tabText, tab === "past" && styles.tabTextActive]}>Past</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderTrip}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Ionicons name="calendar-outline" size={36} color="#90A4AE" />
            <Text style={styles.message}>
              {tab === "upcoming" ? "No trips planned" : "No past trips yet"}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    color: "#024C3F",
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#02685A",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  tabRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#E0F2F1",
    padding: 4,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: {
    color: "#02685A",
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#024C3F",
  },
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    gap: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#024C3F",
    flex: 1,
    marginRight: 8,
  },
  tripDate: {
    fontSize: 14,
    color: "#607D8B",
  },
  tripMeta: {
    fontSize: 12,
    color: "#90A4AE",
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#ECEFF1",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#455A64",
  },
  status_planning: {
    backgroundColor: "#FFF9E6",
  },
  status_active: {
    backgroundColor: "#E6F7F5",
  },
  status_completed: {
    backgroundColor: "#E8F5E9",
  },
  status_cancelled: {
    backgroundColor: "#FFEBEE",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 24,
  },
  message: {
    color: "#607D8B",
    fontSize: 16,
    textAlign: "center",
  },
});
