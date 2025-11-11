import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import { useAuth } from "@/lib/auth/client";
import { useCreateTrip, useHike, useUserProfile } from "@/lib/hooks";

interface GearItem {
  name: string;
  owned: boolean;
  packed: boolean;
}

function validateDate(value: string) {
  if (!value) return false;
  return !Number.isNaN(Date.parse(value));
}

function buildGearSuggestions(
  isOvernight: boolean,
  difficulty: string | null,
  baseGear: string[]
) {
  const checklist = new Set(baseGear);
  if (isOvernight) {
    [
      "Sleeping bag",
      "Sleeping pad",
      "Tent",
      "Cooking kit",
      "Extra layers",
    ].forEach((item) => checklist.add(item));
  }
  if (difficulty === "moderate" || difficulty === "hard") {
    checklist.add("Trekking poles");
    checklist.add("Emergency beacon");
  }
  if (difficulty === "hard") {
    checklist.add("Crampons / microspikes");
  }
  return Array.from(checklist);
}

export default function PlanScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ hikeId?: string }>();
  const { user } = useAuth();

  const [selectedHikeId, setSelectedHikeId] = useState<string | null>(
    params.hikeId || null
  );
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isOvernight, setIsOvernight] = useState(false);
  const [participantInput, setParticipantInput] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [gearChecklist, setGearChecklist] = useState<GearItem[]>([]);
  const [customGear, setCustomGear] = useState("");

  const { data: hike } = useHike(selectedHikeId ?? undefined);
  const { data: profile } = useUserProfile(user?.uid);

  useEffect(() => {
    if (hike) {
      setIsOvernight(hike.overnight);
    }
  }, [hike]);

  const baseGear = useMemo(
    () => [
      "Navigation (map/compass)",
      "Water (2L)",
      "Food",
      "First aid kit",
      "Rain jacket",
      "Headlamp",
    ],
    []
  );

  const gearSuggestions = useMemo(() => {
    if (!hike) return baseGear;
    return buildGearSuggestions(isOvernight, hike.difficulty ?? null, baseGear);
  }, [baseGear, hike, isOvernight]);

  useEffect(() => {
    if (gearChecklist.length === 0 && gearSuggestions.length > 0) {
      setGearChecklist(
        gearSuggestions.map((item) => ({
          name: item,
          owned: profile?.gearOwned?.includes(item) ?? false,
          packed: false,
        }))
      );
    }
  }, [gearSuggestions, gearChecklist.length, profile?.gearOwned]);

  const createTrip = useCreateTrip(user?.uid);

  const addParticipant = () => {
    const value = participantInput.trim();
    if (!value) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      Alert.alert("Invalid email", "Please enter a valid participant email address.");
      return;
    }
    if (participants.includes(value)) {
      setParticipantInput("");
      return;
    }
    setParticipants([...participants, value]);
    setParticipantInput("");
  };

  const toggleGearPacked = (name: string) => {
    setGearChecklist((items) =>
      items.map((item) =>
        item.name === name ? { ...item, packed: !item.packed } : item
      )
    );
  };

  const addGearItem = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setGearChecklist((items) => {
      if (items.some((item) => item.name.toLowerCase() === trimmed.toLowerCase())) {
        return items;
      }
      return [...items, { name: trimmed, owned: false, packed: false }];
    });
  };

  const removeParticipant = (email: string) => {
    setParticipants((items) => items.filter((item) => item !== email));
  };

  const canProceedToGear =
    title.trim().length > 0 && validateDate(startDate) && validateDate(endDate);

  const handleCreateTrip = () => {
    if (!user) {
      Alert.alert("Sign in required", "Please sign in to create a trip.");
      return;
    }
    if (!hike) {
      Alert.alert("Select a hike", "Choose a hike before creating a trip.");
      return;
    }

    createTrip.mutate(
      {
        hikeId: hike.id,
        title,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        participants,
        gearNeeded: gearChecklist.map((item) => item.name),
        isOvernight,
      },
      {
        onSuccess: (tripId) => {
          Alert.alert("Trip created", "Your trip is ready!");
          router.replace(`/trips/${tripId}`);
        },
        onError: (error: any) => {
          Alert.alert("Error", error.message ?? "Failed to create trip");
        },
      }
    );
  };

  if (!selectedHikeId) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentCentered}>
        <Ionicons name="map" size={48} color="#02685A" />
        <Text style={styles.title}>Plan a new adventure</Text>
        <Text style={styles.subtitle}>
          Choose a hike to get started. Filters on Explore help narrow it down.
        </Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("/explore")}
        >
          <Text style={styles.primaryButtonText}>Browse hikes</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Plan your trip</Text>
      {hike && (
        <View style={styles.hikeCard}>
          <Text style={styles.hikeTitle}>{hike.name}</Text>
          <Text style={styles.hikeSubtitle}>
            {hike.region} • {hike.distanceKm.toFixed(1)} km • {hike.difficulty ?? "unknown"}
          </Text>
        </View>
      )}

      {step === 1 && (
        <View style={styles.section}>
          <Text style={styles.stepLabel}>Step 1 of 4</Text>
          <Text style={styles.sectionTitle}>Trip basics</Text>
          <Text style={styles.label}>Trip title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Kepler Track long weekend"
          />
          <Text style={styles.label}>Start date</Text>
          <TextInput
            style={styles.input}
            value={startDate}
            onChangeText={setStartDate}
            placeholder="YYYY-MM-DD"
          />
          <Text style={styles.label}>End date</Text>
          <TextInput
            style={styles.input}
            value={endDate}
            onChangeText={setEndDate}
            placeholder="YYYY-MM-DD"
          />
          <Text style={styles.label}>Trip type</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleButton, !isOvernight && styles.toggleActive]}
              onPress={() => setIsOvernight(false)}
            >
              <Text style={[styles.toggleText, !isOvernight && styles.toggleTextActive]}>Day</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, isOvernight && styles.toggleActive]}
              onPress={() => setIsOvernight(true)}
            >
              <Text style={[styles.toggleText, isOvernight && styles.toggleTextActive]}>
                Overnight
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.primaryButton, !canProceedToGear && styles.buttonDisabled]}
            disabled={!canProceedToGear}
            onPress={() => setStep(2)}
          >
            <Text style={styles.primaryButtonText}>Next: Participants</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 2 && (
        <View style={styles.section}>
          <Text style={styles.stepLabel}>Step 2 of 4</Text>
          <Text style={styles.sectionTitle}>Invite companions</Text>
          <Text style={styles.subtitle}>Add their email so they can see the plan.</Text>
          <View style={styles.participantRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={participantInput}
              onChangeText={setParticipantInput}
              placeholder="friend@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.addButton} onPress={addParticipant}>
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.chipRow}>
            {participants.length === 0 && (
              <Text style={styles.emptyCopy}>No participants added yet.</Text>
            )}
            {participants.map((email) => (
              <View key={email} style={styles.chip}>
                <Text style={styles.chipText}>{email}</Text>
                <TouchableOpacity onPress={() => removeParticipant(email)}>
                  <Ionicons name="close" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setStep(3)}>
            <Text style={styles.secondaryText}>Next: Gear checklist</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 3 && (
        <View style={styles.section}>
          <Text style={styles.stepLabel}>Step 3 of 4</Text>
          <Text style={styles.sectionTitle}>Gear checklist</Text>
          <Text style={styles.subtitle}>
            Mark gear as packed. Items you already own are highlighted.
          </Text>
          {gearChecklist.map((item) => (
            <TouchableOpacity
              key={item.name}
              style={[styles.gearItem, item.packed && styles.gearItemPacked]}
              onPress={() => toggleGearPacked(item.name)}
            >
              <View>
                <Text style={[styles.gearName, item.packed && styles.gearNamePacked]}>
                  {item.name}
                </Text>
                {item.owned && <Text style={styles.gearOwned}>You own this</Text>}
              </View>
              {item.packed ? (
                <Ionicons name="checkmark-circle" size={20} color="#2E7D32" />
              ) : (
                <Ionicons name="ellipse-outline" size={20} color="#90A4AE" />
              )}
            </TouchableOpacity>
          ))}
          <View style={styles.participantRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={customGear}
              onChangeText={setCustomGear}
              placeholder="Add custom gear"
              autoCapitalize="words"
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                addGearItem(customGear);
                setCustomGear("");
              }}
            >
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.primaryButton} onPress={() => setStep(4)}>
            <Text style={styles.primaryButtonText}>Review plan</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 4 && (
        <View style={styles.section}>
          <Text style={styles.stepLabel}>Step 4 of 4</Text>
          <Text style={styles.sectionTitle}>Review</Text>
          <View style={styles.reviewCard}>
            <Text style={styles.reviewText}>Title: {title}</Text>
            <Text style={styles.reviewText}>
              Dates: {new Date(startDate).toLocaleDateString()} – {new Date(endDate).toLocaleDateString()}
            </Text>
            <Text style={styles.reviewText}>Type: {isOvernight ? "Overnight" : "Day"}</Text>
            <Text style={styles.reviewText}>Participants: {participants.length}</Text>
            <Text style={styles.reviewText}>Gear items: {gearChecklist.length}</Text>
          </View>
          <TouchableOpacity
            style={[styles.primaryButton, createTrip.isPending && styles.buttonDisabled]}
            onPress={handleCreateTrip}
            disabled={createTrip.isPending}
          >
            <Text style={styles.primaryButtonText}>
              {createTrip.isPending ? "Creating..." : "Create trip"}
            </Text>
          </TouchableOpacity>
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
    gap: 24,
  },
  contentCentered: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 32,
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    color: "#024C3F",
  },
  hikeCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  hikeTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#024C3F",
  },
  hikeSubtitle: {
    fontSize: 13,
    color: "#607D8B",
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#024C3F",
  },
  subtitle: {
    color: "#607D8B",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#455A64",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#CFD8DC",
  },
  toggleRow: {
    flexDirection: "row",
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#B2DFDB",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  toggleActive: {
    backgroundColor: "#02685A",
    borderColor: "#02685A",
  },
  toggleText: {
    color: "#02685A",
    fontWeight: "700",
  },
  toggleTextActive: {
    color: "#fff",
  },
  participantRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#02685A",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  chipText: {
    color: "#fff",
    fontWeight: "600",
  },
  primaryButton: {
    backgroundColor: "#02685A",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#02685A",
  },
  secondaryText: {
    color: "#02685A",
    fontWeight: "700",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#02685A",
    alignItems: "center",
    justifyContent: "center",
  },
  gearItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#CFD8DC",
  },
  gearItemPacked: {
    borderColor: "#2E7D32",
    backgroundColor: "#E8F5E9",
  },
  gearName: {
    fontSize: 14,
    color: "#37474F",
    fontWeight: "600",
  },
  gearNamePacked: {
    color: "#2E7D32",
    textDecorationLine: "line-through",
  },
  gearOwned: {
    fontSize: 11,
    color: "#2E7D32",
  },
  reviewCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "#CFD8DC",
  },
  reviewText: {
    color: "#37474F",
    fontWeight: "600",
  },
  stepLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    color: "#90A4AE",
  },
  emptyCopy: {
    color: "#90A4AE",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#024C3F",
  },
});
