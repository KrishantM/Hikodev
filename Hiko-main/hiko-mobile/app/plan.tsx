import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { hikeService } from "@/lib/services/hike-service";
import { tripService } from "@/lib/services/trip-service";
import { useAuth } from "@/lib/auth/client";

export default function PlanScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ hikeId?: string }>();
  const { user } = useAuth();

  const [step, setStep] = useState(params.hikeId ? 1 : 0);
  const [selectedHikeId, setSelectedHikeId] = useState<string | null>(
    params.hikeId || null
  );
  const [isOvernight, setIsOvernight] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [title, setTitle] = useState("");

  const { data: hike } = useQuery({
    queryKey: ["hike", selectedHikeId],
    queryFn: () =>
      selectedHikeId ? hikeService.getHike(selectedHikeId) : null,
    enabled: !!selectedHikeId,
  });

  const createTripMutation = useMutation({
    mutationFn: async () => {
      if (!user || !selectedHikeId || !startDate || !endDate || !title) {
        throw new Error("Missing required fields");
      }

      return tripService.createTrip(
        {
          hikeId: selectedHikeId,
          title,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          participants: [],
          isOvernight,
        },
        user.uid
      );
    },
    onSuccess: (tripId) => {
      Alert.alert("Success", "Trip created successfully!");
      router.push(`/trips/${tripId}`);
    },
    onError: (error: any) => {
      Alert.alert("Error", "Failed to create trip: " + error.message);
    },
  });

  if (step === 0) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Select a Hike</Text>
        <Text style={styles.subtitle}>
          Choose a trail to plan your trip around
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/explore")}
        >
          <Text style={styles.buttonText}>Browse Hikes</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Plan Your Trip</Text>

      {hike && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Selected Hike</Text>
          <Text style={styles.cardText}>{hike.name}</Text>
          <Text style={styles.cardText}>{hike.region} • {hike.distanceKm} km</Text>
        </View>
      )}

      {step === 1 && (
        <View style={styles.step}>
          <Text style={styles.stepTitle}>Step 1: Trip Type</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.toggleButton, isOvernight && styles.toggleButtonActive]}
              onPress={() => setIsOvernight(true)}
            >
              <Text style={[styles.toggleText, isOvernight && styles.toggleTextActive]}>
                Overnight
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, !isOvernight && styles.toggleButtonActive]}
              onPress={() => setIsOvernight(false)}
            >
              <Text style={[styles.toggleText, !isOvernight && styles.toggleTextActive]}>
                Day Trip
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setStep(2)}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 2 && (
        <View style={styles.step}>
          <Text style={styles.stepTitle}>Step 2: Dates</Text>
          <Text style={styles.label}>Trip Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., Tongariro Crossing Adventure"
          />
          <Text style={styles.label}>Start Date</Text>
          <TextInput
            style={styles.input}
            value={startDate}
            onChangeText={setStartDate}
            placeholder="YYYY-MM-DD"
          />
          <Text style={styles.label}>End Date</Text>
          <TextInput
            style={styles.input}
            value={endDate}
            onChangeText={setEndDate}
            placeholder="YYYY-MM-DD"
          />
          <TouchableOpacity
            style={[styles.button, (!title || !startDate || !endDate) && styles.buttonDisabled]}
            onPress={() => setStep(3)}
            disabled={!title || !startDate || !endDate}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 3 && (
        <View style={styles.step}>
          <Text style={styles.stepTitle}>Step 3: Review & Create</Text>
          <View style={styles.review}>
            <Text style={styles.reviewText}>Trip: {title}</Text>
            <Text style={styles.reviewText}>
              Dates: {new Date(startDate).toLocaleDateString()} -{" "}
              {new Date(endDate).toLocaleDateString()}
            </Text>
            <Text style={styles.reviewText}>
              Type: {isOvernight ? "Overnight" : "Day Trip"}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.button, createTripMutation.isPending && styles.buttonDisabled]}
            onPress={() => createTripMutation.mutate()}
            disabled={createTripMutation.isPending}
          >
            <Text style={styles.buttonText}>
              {createTripMutation.isPending ? "Creating..." : "Create Trip"}
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
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#F5F1E8",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#02685A",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  step: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#02685A",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#02685A",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#02685A",
    backgroundColor: "transparent",
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: "#02685A",
  },
  toggleText: {
    color: "#02685A",
    fontSize: 16,
    fontWeight: "600",
  },
  toggleTextActive: {
    color: "#fff",
  },
  review: {
    backgroundColor: "#F5F1E8",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  reviewText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
});

