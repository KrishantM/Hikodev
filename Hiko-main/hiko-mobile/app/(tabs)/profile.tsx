import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import { useAuth, signOut } from "@/lib/auth/client";
import { useUpdateUserProfile, useUserProfile } from "@/lib/hooks";
import { getHikesByIds } from "@/lib/services/hikes";
import type { Hike } from "@/lib/types";

const EXPERIENCE_LEVELS = ["beginner", "intermediate", "advanced"] as const;

export default function ProfileScreen() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const updateProfile = useUpdateUserProfile(user?.uid);
  const { data: profile, isLoading: profileLoading } = useUserProfile(user?.uid);

  const [displayName, setDisplayName] = useState("");
  const [experience, setExperience] = useState<(typeof EXPERIENCE_LEVELS)[number]>("beginner");
  const [gear, setGear] = useState<string[]>([]);
  const [gearInput, setGearInput] = useState("");

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName ?? user?.displayName ?? "");
      setExperience(profile.experienceLevel ?? "beginner");
      setGear(profile.gearOwned ?? []);
    }
  }, [profile, user?.displayName]);

  const { data: savedHikes = [] } = useQuery<Hike[]>({
    queryKey: ["saved-hikes", profile?.savedHikes],
    queryFn: () =>
      profile?.savedHikes && profile.savedHikes.length > 0
        ? getHikesByIds(profile.savedHikes)
        : Promise.resolve([]),
    enabled: Boolean(profile?.savedHikes?.length),
  });

  const handleSaveProfile = () => {
    updateProfile.mutate({
      displayName,
      experienceLevel: experience,
      gearOwned: gear,
    });
  };

  const addGear = () => {
    const value = gearInput.trim();
    if (!value) return;
    if (gear.includes(value)) {
      setGearInput("");
      return;
    }
    setGear([...gear, value]);
    setGearInput("");
  };

  const removeGear = (item: string) => {
    setGear((items) => items.filter((gearItem) => gearItem !== item));
  };

  if (loading || profileLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#02685A" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centered}>
        <Ionicons name="person-circle" size={64} color="#90A4AE" />
        <Text style={styles.message}>Sign in to edit your profile.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push("/auth/signin")}>
          <Text style={styles.primaryButtonText}>Sign in</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.heading}>Profile</Text>
        <Text style={styles.label}>Display name</Text>
        <TextInput
          style={styles.input}
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Your name"
        />
        <Text style={styles.label}>Experience level</Text>
        <View style={styles.chipRow}>
          {EXPERIENCE_LEVELS.map((level) => (
            <TouchableOpacity
              key={level}
              style={[styles.chip, experience === level && styles.chipActive]}
              onPress={() => setExperience(level)}
            >
              <Text style={[styles.chipText, experience === level && styles.chipTextActive]}>
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={[styles.primaryButton, styles.saveButton, updateProfile.isPending && styles.buttonDisabled]}
          disabled={updateProfile.isPending}
          onPress={handleSaveProfile}
        >
          <Text style={styles.primaryButtonText}>
            {updateProfile.isPending ? "Saving..." : "Save profile"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Gear owned</Text>
        <View style={styles.addRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={gearInput}
            onChangeText={setGearInput}
            placeholder="Add gear item"
          />
          <TouchableOpacity style={styles.addButton} onPress={addGear}>
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        {gear.length === 0 ? (
          <Text style={styles.message}>Add gear to speed up planning checklists.</Text>
        ) : (
          gear.map((item) => (
            <View key={item} style={styles.gearRow}>
              <Text style={styles.gearText}>{item}</Text>
              <TouchableOpacity onPress={() => removeGear(item)}>
                <Ionicons name="trash" size={16} color="#EF5350" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Saved hikes</Text>
        {savedHikes.length === 0 ? (
          <Text style={styles.message}>No saved hikes yet. Tap the bookmark icon on a hike.</Text>
        ) : (
          savedHikes.map((hike) => (
            <TouchableOpacity
              key={hike.id}
              style={styles.hikeRow}
              onPress={() => router.push(`/hikes/${hike.id}`)}
            >
              <View>
                <Text style={styles.hikeTitle}>{hike.name}</Text>
                <Text style={styles.hikeSubtitle}>{hike.region}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#90A4AE" />
            </TouchableOpacity>
          ))
        )}
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={async () => {
        await signOut();
        router.replace("/(tabs)");
      }}>
        <Text style={styles.signOutText}>Sign out</Text>
      </TouchableOpacity>
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#024C3F",
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
  chipRow: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#E0F2F1",
  },
  chipActive: {
    backgroundColor: "#02685A",
  },
  chipText: {
    color: "#02685A",
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#fff",
  },
  primaryButton: {
    backgroundColor: "#02685A",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButton: {
    alignSelf: "flex-start",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  addRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#02685A",
    alignItems: "center",
    justifyContent: "center",
  },
  gearRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ECEFF1",
  },
  gearText: {
    color: "#37474F",
  },
  hikeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ECEFF1",
  },
  hikeTitle: {
    fontWeight: "600",
    color: "#024C3F",
  },
  hikeSubtitle: {
    color: "#607D8B",
    fontSize: 12,
  },
  signOutButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#EF5350",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  signOutText: {
    color: "#EF5350",
    fontWeight: "700",
  },
  message: {
    color: "#607D8B",
    fontSize: 14,
    textAlign: "center",
  },
});
