import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { hikeService } from "@/lib/services/hike-service";
import { useRouter } from "expo-router";
import { Hike } from "@/lib/types";

export default function ExploreScreen() {
  const router = useRouter();
  const { data: hikes, isLoading } = useQuery({
    queryKey: ["hikes"],
    queryFn: () => hikeService.listHikes(),
  });

  const renderHike = ({ item }: { item: Hike }) => (
    <TouchableOpacity
      onPress={() => router.push(`/hikes/${item.id}`)}
      activeOpacity={0.7}
      style={styles.hikeCard}
    >
      <Text style={styles.hikeName}>{item.name}</Text>
      <Text style={styles.hikeRegion}>{item.region}</Text>
      <View style={styles.hikeInfo}>
        <Text style={styles.hikeDistance}>{item.distanceKm} km</Text>
        <Text style={styles.hikeDifficulty}>
          {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading trails...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={hikes || []}
        renderItem={renderHike}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No trails found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your filters or check back later
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
  list: {
    padding: 16,
    gap: 12,
  },
  hikeCard: {
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
  hikeName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#02685A",
    marginBottom: 4,
  },
  hikeRegion: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  hikeInfo: {
    flexDirection: "row",
    gap: 16,
  },
  hikeDistance: {
    fontSize: 14,
    color: "#02685A",
    fontWeight: "500",
  },
  hikeDifficulty: {
    fontSize: 14,
    color: "#666",
  },
  empty: {
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});
