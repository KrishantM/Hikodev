import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import type { DocumentSnapshot } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";

import { hikeDocSchema } from "@/lib/schemas";
import type { Hike, HikeFilters } from "@/lib/types";
import { db, storage } from "../firebase/config";

function timestampToDate(value?: Timestamp | Date | null): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  return value;
}

function decodeHike(snapshot: DocumentSnapshot): Hike | null {
  const data = snapshot.data();
  if (!data) return null;
  const parsed = hikeDocSchema.safeParse({
    ...data,
    createdAt: timestampToDate(data.createdAt) ?? new Date(),
    updatedAt: timestampToDate(data.updatedAt) ?? new Date(),
    lastOfficialStatusAt: timestampToDate(data.lastOfficialStatusAt),
    lastUserStatusAt: timestampToDate(data.lastUserStatusAt),
  });

  if (!parsed.success) {
    console.warn("Failed to parse hike document", parsed.error);
    return null;
  }

  return {
    ...parsed.data,
    id: snapshot.id,
  };
}

export async function listHikes(filters: HikeFilters = {}): Promise<Hike[]> {
  if (!db) {
    return [];
  }

  let hikesQuery = query(collection(db, "hikes"), orderBy("name"), limit(100));

  if (filters.region) {
    hikesQuery = query(hikesQuery, where("region", "==", filters.region));
  }

  if (filters.difficulty && filters.difficulty.length > 0) {
    const difficulties = filters.difficulty.filter(Boolean) as string[];
    if (difficulties.length > 0) {
      hikesQuery = query(hikesQuery, where("difficulty", "in", difficulties));
    }
  }

  if (typeof filters.overnight === "boolean") {
    hikesQuery = query(hikesQuery, where("overnight", "==", filters.overnight));
  }

  if (filters.tags && filters.tags.length > 0) {
    hikesQuery = query(
      hikesQuery,
      where("tags", "array-contains-any", filters.tags.slice(0, 10))
    );
  }

  const snapshot = await getDocs(hikesQuery);
  return snapshot.docs
    .map((docSnap) => decodeHike(docSnap as any))
    .filter((hike): hike is Hike => Boolean(hike));
}

export async function getHike(id: string): Promise<Hike | null> {
  if (!db) return null;
  const docRef = doc(db, "hikes", id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return decodeHike(snapshot as any);
}

export async function getRouteUrl(id: string): Promise<string | null> {
  if (!db || !storage) return null;
  const hike = await getHike(id);
  if (!hike?.geojsonPath) {
    return null;
  }
  try {
    const fileRef = ref(storage, hike.geojsonPath);
    return await getDownloadURL(fileRef);
  } catch (error) {
    console.warn("Failed to download route GeoJSON", error);
    return null;
  }
}

export async function getRouteGeoJson(id: string): Promise<string | null> {
  const url = await getRouteUrl(id);
  if (!url) return null;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch GeoJSON ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.warn("Failed to fetch route GeoJSON", error);
    return null;
  }
}

export async function getHikesByIds(ids: string[]): Promise<Hike[]> {
  if (!db || ids.length === 0) return [];
  const uniqueIds = Array.from(new Set(ids)).slice(0, 10);
  const snapshots = await Promise.all(uniqueIds.map((hikeId) => getDoc(doc(db!, "hikes", hikeId))));
  return snapshots
    .map((snap) => (snap.exists() ? decodeHike(snap) : null))
    .filter((value): value is Hike => Boolean(value));
}
