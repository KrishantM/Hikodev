import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useAuth } from "@/lib/auth/client";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "@/lib/auth/client";

export default function ProfileScreen() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const { data: userData } = useQuery({
    queryKey: ["user", user?.uid],
    queryFn: async () => {
      if (!user || !db) return null;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    },
    enabled: !!user,
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>
            Please sign in to view your profile
          </Text>
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.name}>
          {userData?.name || user.displayName || "User"}
        </Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {userData?.bio && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Bio</Text>
          <Text style={styles.bio}>{userData.bio}</Text>
        </View>
      )}

      {userData?.experienceLevel && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Experience Level</Text>
          <Text style={styles.experience}>
            {userData.experienceLevel.charAt(0).toUpperCase() +
              userData.experienceLevel.slice(1)}
          </Text>
        </View>
      )}

      {userData?.gearOwned && userData.gearOwned.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>My Gear</Text>
          {userData.gearOwned.map((gear: string, index: number) => (
            <View key={index} style={styles.gearItem}>
              <Text style={styles.gearText}>{gear}</Text>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.signOutButton}
        onPress={async () => {
          await signOut();
          router.replace("/(tabs)");
        }}
      >
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
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
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#02685A",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#666",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#02685A",
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  experience: {
    fontSize: 14,
    color: "#666",
  },
  gearItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  gearText: {
    fontSize: 14,
    color: "#666",
  },
  signInButton: {
    backgroundColor: "#02685A",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  signInText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  signOutButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#02685A",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  signOutText: {
    color: "#02685A",
    fontSize: 16,
    fontWeight: "600",
  },
});
