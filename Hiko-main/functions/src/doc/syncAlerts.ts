import { Timestamp } from "firebase-admin/firestore";
import { logger } from "firebase-functions";

import { firestore } from "../firebase";
import { fetchAll } from "./fetch";
import { NormalizedAlert, toAlert } from "./normalize";

interface SyncAlertsSummary {
  alerts: number;
  tracksUpdated: number;
}

const severityRank: Record<NonNullable<NormalizedAlert["severity"]>, number> = {
  info: 1,
  warning: 2,
  closed: 3,
};

function severityToStatus(
  severity?: NormalizedAlert["severity"]
): "open" | "caution" | "closed" | "unknown" {
  if (!severity) return "unknown";
  if (severity === "closed") return "closed";
  if (severity === "warning") return "caution";
  return "open";
}

export async function syncDocAlerts(): Promise<SyncAlertsSummary> {
  const alertsRaw = await fetchAll<any>("/alerts");
  const now = Timestamp.now();
  const trackStatus: Map<string, NormalizedAlert["severity"]> = new Map();

  for (const raw of alertsRaw) {
    try {
      const normalized = toAlert(raw);
      const docRef = firestore.collection("docAlerts").doc(normalized.alertId);
      const snapshot = await docRef.get();
      const createdAt = snapshot.exists ? snapshot.data()?.createdAt ?? now : now;

      await docRef.set(
        {
          ...normalized,
          createdAt,
          updatedAt: now,
        },
        { merge: true }
      );

      if (
        normalized.sourceType === "track" &&
        normalized.sourceId &&
        normalized.severity
      ) {
        const current = trackStatus.get(normalized.sourceId);
        if (
          !current ||
          severityRank[normalized.severity] > (current ? severityRank[current] : 0)
        ) {
          trackStatus.set(normalized.sourceId, normalized.severity);
        }
      }
    } catch (error) {
      logger.error("Failed to sync DOC alert", error);
    }
  }

  let tracksUpdated = 0;
  for (const [trackId, severity] of trackStatus.entries()) {
    try {
      const docRef = firestore.collection("hikes").doc(trackId);
      await docRef.set(
        {
          statusSummary: severityToStatus(severity),
          lastOfficialStatusAt: now,
          updatedAt: now,
        },
        { merge: true }
      );
      tracksUpdated += 1;
    } catch (error) {
      logger.error(`Failed to update hike ${trackId} after alert sync`, error);
    }
  }

  return { alerts: alertsRaw.length, tracksUpdated };
}
