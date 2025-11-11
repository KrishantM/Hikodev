import { Hike, HikeFilters } from "@/lib/types";
import { db, storage } from "@/lib/firebase/config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  limit,
  orderBy,
} from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";

export class HikeService {
  async listHikes(filters?: HikeFilters): Promise<Hike[]> {
    if (!db) {
      console.warn("Firestore not initialized. Returning empty array.");
      return [];
    }
    const hikesRef = collection(db, "hikes");
    let q = query(hikesRef);

    if (filters?.difficulty && filters.difficulty.length > 0) {
      q = query(q, where("difficulty", "in", filters.difficulty));
    }

    if (filters?.overnight !== undefined) {
      q = query(q, where("overnight", "==", filters.overnight));
    }

    if (filters?.region) {
      q = query(q, where("region", "==", filters.region));
    }

    q = query(q, orderBy("name"), limit(50));

    const snapshot = await getDocs(q);
    let hikes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
      lastOfficialStatusAt: doc.data().lastOfficialStatusAt?.toDate(),
      lastUserStatusAt: doc.data().lastUserStatusAt?.toDate(),
    })) as Hike[];

    // Apply client-side filters
    if (filters?.maxDistance) {
      hikes = hikes.filter((h) => h.distanceKm <= filters.maxDistance!);
    }

    if (filters?.features && filters.features.length > 0) {
      hikes = hikes.filter((h) =>
        filters.features!.some((f) => h.features.includes(f))
      );
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      hikes = hikes.filter(
        (h) =>
          h.name.toLowerCase().includes(searchLower) ||
          h.region.toLowerCase().includes(searchLower) ||
          h.tags.some((t) => t.toLowerCase().includes(searchLower))
      );
    }

    return hikes;
  }

  async getHike(id: string): Promise<Hike | null> {
    if (!db) {
      console.warn("Firestore not initialized.");
      return null;
    }
    const docRef = doc(db, "hikes", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
      lastOfficialStatusAt: data.lastOfficialStatusAt?.toDate(),
      lastUserStatusAt: data.lastUserStatusAt?.toDate(),
    } as Hike;
  }

  async saveHikeForUser(userId: string, hikeId: string): Promise<void> {
    if (!db) {
      throw new Error("Firestore not initialized");
    }
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error("User not found");
    }

    const user = userSnap.data();
    const savedHikes = user.savedHikes || [];

    if (!savedHikes.includes(hikeId)) {
      await userRef.update({
        savedHikes: [...savedHikes, hikeId],
        updatedAt: new Date(),
      });
    }
  }

  async getHikeGeoJSONUrl(hikeId: string): Promise<string | null> {
    const hike = await this.getHike(hikeId);
    if (!hike?.geojsonPath || !storage) {
      return null;
    }

    try {
      const storageRef = ref(storage, hike.geojsonPath);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("Error getting GeoJSON URL:", error);
      return null;
    }
  }
}

export const hikeService = new HikeService();
