import {
  Timestamp,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { docAlertSchema } from "@/lib/schemas";
import type { DocAlert } from "@/lib/types";
import { db } from "../firebase/config";

function timestampToDate(value?: Timestamp | Date | null): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  return value;
}

function decodeAlert(snapshot: any): DocAlert | null {
  const data = typeof snapshot.data === "function" ? snapshot.data() : snapshot.data;
  if (!data) return null;
  const parsed = docAlertSchema.safeParse({
    ...data,
    updatedAt: timestampToDate(data.updatedAt) ?? new Date(),
    validFrom: timestampToDate(data.validFrom),
    validTo: timestampToDate(data.validTo),
  });

  if (!parsed.success) {
    console.warn("Failed to parse alert", parsed.error);
    return null;
  }

  return { ...parsed.data, id: snapshot.id };
}

export async function listAlertsForTrack(trackId: string): Promise<DocAlert[]> {
  if (!db) return [];
  const alertsRef = collection(db, "docAlerts");
  const alertsQuery = query(
    alertsRef,
    where("sourceId", "==", trackId),
    orderBy("updatedAt", "desc"),
    limit(10)
  );
  const snapshot = await getDocs(alertsQuery);
  return snapshot.docs
    .map((docSnap) => decodeAlert(docSnap))
    .filter((alert): alert is DocAlert => Boolean(alert));
}

export async function listAlertsByRegion(region: string): Promise<DocAlert[]> {
  if (!db) return [];
  const alertsRef = collection(db, "docAlerts");
  const alertsQuery = query(
    alertsRef,
    where("region", "==", region),
    orderBy("updatedAt", "desc"),
    limit(20)
  );
  const snapshot = await getDocs(alertsQuery);
  return snapshot.docs
    .map((docSnap) => decodeAlert(docSnap))
    .filter((alert): alert is DocAlert => Boolean(alert));
}
