import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { tripService } from "@/lib/services/trip-service";
import { useAuth } from "@/lib/auth/client";
import { useRouter } from "expo-router";
import { Trip } from "@/lib/types";

export default function TripsScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const { data: trips, isLoading } = useQuery({
    queryKey: ["trips", user?.uid],
    queryFn: () => (user ? tripService.listTrips(user.uid) : []),
    enabled: !!user,
  });

  const renderTrip = ({ item }: { item: Trip }) => (
    <TouchableOpacity
      onPress={() => router.push(`/trips/${item.id}`)}
      activeOpacity={0.7}
      style={styles.tripCard}
    >
      <Text style={styles.tripTitle}>{item.title}</Text>
      <Text style={styles.tripDate}>
        {new Date(item.startDate).toLocaleDateString()} -{" "}
        {new Date(item.endDate).toLocaleDateString()}
      </Text>
      <View style={styles.tripStatus}>
        <Text
          style={[
            styles.statusBadge,
            item.status === "active" && styles.statusActive,
            item.status === "planning" && styles.statusPlanning,
          ]}
        >
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Please sign in to view your trips</Text>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => router.push("/auth/signin")}
          >
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading trips...</Text>
      </View>
    );
  }

  const upcomingTrips = trips?.filter(
    (t) => t.status === "planning" || t.status === "active"
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Trips</Text>
        <TouchableOpacity
          style={styles.newTripButton}
          onPress={() => router.push("/plan")}
        >
          <Text style={styles.newTripText}>New Trip</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={upcomingTrips || []}
        renderItem={renderTrip}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No upcoming trips</Text>
            <Text style={styles.emptySubtext}>
              Start planning your next adventure!
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
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#02685A",
  },
  newTripButton: {
    backgroundColor: "#02685A",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  newTripText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  list: {
    padding: 16,
  },
  tripCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#02685A",
    marginBottom: 4,
  },
  tripDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  tripStatus: {
    flexDirection: "row",
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: "#f0f0f0",
  },
  statusActive: {
    color: "#02685A",
    backgroundColor: "#E6F7F5",
  },
  statusPlanning: {
    color: "#F4D03F",
    backgroundColor: "#FFF9E6",
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  signInButton: {
    backgroundColor: "#02685A",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  signInText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
