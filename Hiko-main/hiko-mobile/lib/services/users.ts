import {
  Timestamp,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { z } from "zod";

import { userDocSchema } from "@/lib/schemas";
import type { UserProfile } from "@/lib/types";
import { db } from "@/lib/firebase/config";

const updateUserSchema = userDocSchema.partial().extend({
  displayName: z.string().optional(),
  gearOwned: z.array(z.string()).optional(),
});

function timestampToDate(value?: Timestamp | Date | null): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Timestamp) return value.toDate();
  return value;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!db) return null;
  const snapshot = await getDoc(doc(db, "users", uid));
  if (!snapshot.exists()) return null;
  const data = snapshot.data();
  const parsed = userDocSchema.safeParse({
    ...data,
    createdAt: timestampToDate(data.createdAt) ?? new Date(),
    updatedAt: timestampToDate(data.updatedAt) ?? new Date(),
  });
  if (!parsed.success) {
    console.warn("Failed to parse user profile", parsed.error);
    return null;
  }
  return { ...parsed.data, id: uid };
}

export async function upsertUserProfile(
  uid: string,
  payload: Partial<UserProfile>
): Promise<void> {
  if (!db) throw new Error("Firestore not initialised");
  const updates = updateUserSchema.parse({
    ...payload,
    updatedAt: new Date(),
  });

  await setDoc(
    doc(db, "users", uid),
    {
      ...updates,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function updateUserGear(uid: string, gear: string[]): Promise<void> {
  if (!db) throw new Error("Firestore not initialised");
  await updateDoc(doc(db, "users", uid), {
    gearOwned: gear,
    updatedAt: serverTimestamp(),
  });
}

export async function setSavedHike(uid: string, hikeId: string, saved: boolean) {
  if (!db) throw new Error("Firestore not initialised");
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);
  const current: string[] = snapshot.exists() ? snapshot.data()?.savedHikes ?? [] : [];
  const next = saved
    ? Array.from(new Set([...current, hikeId]))
    : current.filter((id) => id !== hikeId);
  await setDoc(
    userRef,
    {
      savedHikes: next,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
