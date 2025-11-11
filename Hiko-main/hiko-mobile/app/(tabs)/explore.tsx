import { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { WeatherBadge } from "@/components/WeatherBadge";
import { StatusChip } from "@/components/StatusChip";
import { HikeMap } from "@/lib/map";
import { useHikeFilters } from "@/lib/store/useHikeFilters";
import { useHikes } from "@/lib/hooks";
import type { Hike } from "@/lib/types";

const REGIONS = [
  "Northland",
  "Auckland",
  "Waikato",
  "Bay of Plenty",
  "Wellington",
  "Canterbury",
  "Otago",
  "Southland",
];

const TAGS = ["Great Walk", "Coastal", "Alpine", "Family"];

const DIFFICULTIES: Array<{ key: NonNullable<Hike["difficulty"]>; label: string }> = [
  { key: "easy", label: "Easy" },
  { key: "moderate", label: "Moderate" },
  { key: "hard", label: "Hard" },
];

export default function ExploreScreen() {
  const router = useRouter();
  const {
    region,
    difficulty,
    overnight,
    tags,
    setRegion,
    toggleDifficulty,
    setOvernight,
    toggleTag,
    reset,
  } = useHikeFilters();

  const filters = useMemo(
    () => ({
      region,
      difficulty: difficulty.length > 0 ? difficulty : undefined,
      overnight,
      tags: tags.length > 0 ? tags : undefined,
    }),
    [region, difficulty, overnight, tags]
  );

  const { data: hikes = [], isLoading } = useHikes(filters);
  const highlighted = hikes[0];

  const renderHike = ({ item }: { item: Hike }) => (
    <TouchableOpacity
      onPress={() => router.push(`/hikes/${item.id}`)}
      activeOpacity={0.85}
      style={styles.hikeCard}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.hikeName}>{item.name}</Text>
        <StatusChip status={item.statusSummary ?? "unknown"} />
      </View>
      <Text style={styles.hikeRegion}>{item.region}</Text>
      <View style={styles.hikeMetaRow}>
        <View style={styles.metaPill}>
          <Ionicons name="map-outline" size={14} color="#02685A" />
          <Text style={styles.metaText}>{item.distanceKm.toFixed(1)} km</Text>
        </View>
        {item.difficulty && (
          <View style={styles.metaPill}>
            <Ionicons name="barbell-outline" size={14} color="#02685A" />
            <Text style={styles.metaText}>{item.difficulty}</Text>
          </View>
        )}
        <View style={styles.metaPill}>
          <Ionicons
            name={item.overnight ? "moon-outline" : "sunny-outline"}
            size={14}
            color="#02685A"
          />
          <Text style={styles.metaText}>{item.overnight ? "Overnight" : "Day"}</Text>
        </View>
        <WeatherBadge
          hikeId={item.id}
          lat={item.start.lat}
          lng={item.start.lng}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={hikes}
        keyExtractor={(item) => item.id}
        renderItem={renderHike}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Explore Aotearoa</Text>
            <Text style={styles.subtitle}>
              Filter by region, difficulty, or overnight adventures.
            </Text>
            <View style={styles.mapContainer}>
              {highlighted ? (
                <HikeMap coordinates={highlighted.start} />
              ) : (
                <View style={styles.mapPlaceholder}>
                  <Text style={styles.mapPlaceholderText}>Select a hike to preview</Text>
                </View>
              )}
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterRow}
            >
              <TouchableOpacity style={styles.filterChip} onPress={reset}>
                <Ionicons name="refresh" size={16} color="#02685A" />
                <Text style={styles.filterText}>Reset</Text>
              </TouchableOpacity>
              {REGIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => setRegion(region === option ? undefined : option)}
                  style={[
                    styles.filterChip,
                    region === option && styles.filterChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      region === option && styles.filterTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.sectionLabelRow}>
              <Text style={styles.sectionLabel}>Difficulty</Text>
            </View>
            <View style={styles.filterPillsRow}>
              {DIFFICULTIES.map((entry) => (
                <TouchableOpacity
                  key={entry.key}
                  onPress={() => toggleDifficulty(entry.key)}
                  style={[
                    styles.filterPill,
                    difficulty.includes(entry.key) && styles.filterPillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      difficulty.includes(entry.key) && styles.filterPillTextActive,
                    ]}
                  >
                    {entry.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.sectionLabelRow}>
              <Text style={styles.sectionLabel}>Trip type</Text>
            </View>
            <View style={styles.filterPillsRow}>
              <TouchableOpacity
                onPress={() => setOvernight(undefined)}
                style={[
                  styles.filterPill,
                  overnight === undefined && styles.filterPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    overnight === undefined && styles.filterPillTextActive,
                  ]}
                >
                  Any
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setOvernight(false)}
                style={[
                  styles.filterPill,
                  overnight === false && styles.filterPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    overnight === false && styles.filterPillTextActive,
                  ]}
                >
                  Day
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setOvernight(true)}
                style={[
                  styles.filterPill,
                  overnight === true && styles.filterPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    overnight === true && styles.filterPillTextActive,
                  ]}
                >
                  Overnight
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.sectionLabelRow}>
              <Text style={styles.sectionLabel}>Tags</Text>
            </View>
            <View style={styles.filterPillsRow}>
              {TAGS.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  onPress={() => toggleTag(tag)}
                  style={[
                    styles.filterPill,
                    tags.includes(tag) && styles.filterPillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      tags.includes(tag) && styles.filterPillTextActive,
                    ]}
                  >
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#02685A" />
            ) : (
              <>
                <Ionicons name="trail-sign" size={36} color="#9E9E9E" />
                <Text style={styles.emptyTitle}>No hikes match</Text>
                <Text style={styles.emptySubtitle}>
                  Try widening your filters or check back after the next DOC sync.
                </Text>
              </>
            )}
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
  listContent: {
    padding: 16,
    gap: 12,
  },
  header: {
    gap: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#024C3F",
  },
  subtitle: {
    fontSize: 14,
    color: "#546E7A",
  },
  mapContainer: {
    borderRadius: 16,
    overflow: "hidden",
  },
  mapPlaceholder: {
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E0F2F1",
    borderRadius: 16,
  },
  mapPlaceholderText: {
    color: "#546E7A",
    fontWeight: "500",
  },
  filterRow: {
    gap: 8,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#B2DFDB",
    backgroundColor: "#fff",
  },
  filterChipActive: {
    backgroundColor: "#02685A",
    borderColor: "#02685A",
  },
  filterText: {
    fontSize: 12,
    color: "#02685A",
    fontWeight: "600",
  },
  filterTextActive: {
    color: "#fff",
  },
  sectionLabelRow: {
    marginTop: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#024C3F",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  filterPillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#B2DFDB",
  },
  filterPillActive: {
    backgroundColor: "#02685A",
    borderColor: "#02685A",
  },
  filterPillText: {
    color: "#02685A",
    fontWeight: "600",
  },
  filterPillTextActive: {
    color: "#fff",
  },
  hikeCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    gap: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  hikeName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#024C3F",
    flex: 1,
  },
  hikeRegion: {
    fontSize: 13,
    color: "#607D8B",
  },
  hikeMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
  },
  metaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#E0F2F1",
    borderRadius: 999,
  },
  metaText: {
    fontSize: 12,
    color: "#02685A",
    fontWeight: "600",
  },
  emptyState: {
    marginTop: 80,
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#37474F",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#607D8B",
    textAlign: "center",
  },
});
