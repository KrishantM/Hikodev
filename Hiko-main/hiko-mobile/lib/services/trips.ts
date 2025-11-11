import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { z } from "zod";

import { tripDocSchema } from "@/lib/schemas";
import type { CreateTripInput, Trip, UpdateTripInput } from "@/lib/types";
import { db } from "../firebase/config";

const createTripInputSchema = z.object({
  hikeId: z.string().min(1),
  title: z.string().min(1),
  startDate: z.date(),
  endDate: z.date(),
  participants: z.array(z.string().min(1)).default([]),
  gearNeeded: z.array(z.string()).default([]),
  isOvernight: z.boolean(),
});

function timestampToDate(value?: Timestamp | Date | null): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  return value;
}

function decodeTrip(snapshot: any): Trip | null {
  const data = typeof snapshot.data === "function" ? snapshot.data() : snapshot.data;
  if (!data) return null;
  const parsed = tripDocSchema.safeParse({
    ...data,
    startDate: timestampToDate(data.startDate) ?? new Date(),
    endDate: timestampToDate(data.endDate) ?? new Date(),
    createdAt: timestampToDate(data.createdAt) ?? new Date(),
    updatedAt: timestampToDate(data.updatedAt) ?? new Date(),
  });
  if (!parsed.success) {
    console.warn("Failed to parse trip", parsed.error);
    return null;
  }
  return { ...parsed.data, id: snapshot.id };
}

export async function createTrip(
  input: CreateTripInput,
  userId: string
): Promise<string> {
  if (!db) throw new Error("Firestore is not initialised");
  const validated = createTripInputSchema.parse(input);
  const participants = Array.from(new Set([userId, ...validated.participants]));

  const docRef = await addDoc(collection(db, "trips"), {
    hikeId: validated.hikeId,
    createdBy: userId,
    title: validated.title,
    startDate: validated.startDate,
    endDate: validated.endDate,
    participants,
    gearNeeded: validated.gearNeeded,
    status: "planning",
    isOvernight: validated.isOvernight,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function getTrip(id: string): Promise<Trip | null> {
  if (!db) return null;
  const snapshot = await getDoc(doc(db, "trips", id));
  if (!snapshot.exists()) return null;
  return decodeTrip(snapshot);
}

export async function listTrips(userId: string): Promise<Trip[]> {
  if (!db) return [];
  const tripsQuery = query(
    collection(db, "trips"),
    where("participants", "array-contains", userId),
    orderBy("startDate", "desc")
  );
  const snapshot = await getDocs(tripsQuery);
  return snapshot.docs
    .map((docSnap) => decodeTrip(docSnap))
    .filter((trip): trip is Trip => Boolean(trip));
}

export async function updateTrip(
  id: string,
  patch: UpdateTripInput
): Promise<void> {
  if (!db) throw new Error("Firestore is not initialised");
  const docRef = doc(db, "trips", id);
  const payload: Record<string, unknown> = { updatedAt: serverTimestamp() };
  if (patch.title) payload.title = patch.title;
  if (patch.startDate) payload.startDate = patch.startDate;
  if (patch.endDate) payload.endDate = patch.endDate;
  if (patch.participants) payload.participants = patch.participants;
  if (patch.gearNeeded) payload.gearNeeded = patch.gearNeeded;
  if (patch.status) payload.status = patch.status;
  await updateDoc(docRef, payload);
}
