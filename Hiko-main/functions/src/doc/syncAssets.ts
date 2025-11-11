import { Timestamp } from "firebase-admin/firestore";
import type { File } from "firebase-admin/storage";
import { logger } from "firebase-functions";

import { firestore, storage } from "../firebase";
import { fetchAll, fetchSingle } from "./fetch";
import {
  NormalizedCampsite,
  NormalizedHike,
  NormalizedHut,
  toCampsite,
  toHike,
  toHut,
} from "./normalize";

interface SyncSummary {
  tracks: number;
  huts: number;
  campsites: number;
  geojsonStored: number;
}

interface SyncOptions {
  trackLimit?: number;
}

function createTimestampPair(existing?: FirebaseFirestore.DocumentData) {
  const now = Timestamp.now();
  if (!existing) {
    return { createdAt: now, updatedAt: now };
  }
  return {
    createdAt: existing.createdAt ?? now,
    updatedAt: now,
  };
}

async function uploadGeoJson(
  docTrackId: string,
  geometry: unknown
): Promise<string | undefined> {
  if (!geometry) return undefined;
  try {
    const bucket = storage.bucket();
    const path = `routes/${docTrackId}.geojson`;
    const file: File = bucket.file(path);
    const payload =
      typeof geometry === "string" ? geometry : JSON.stringify(geometry);
    await file.save(payload, {
      contentType: "application/geo+json",
      cacheControl: "public,max-age=86400",
      resumable: false,
    });
    return path;
  } catch (error) {
    logger.error(`Failed to upload GeoJSON for ${docTrackId}`, error);
    return undefined;
  }
}

function extractGeometry(raw: any): unknown {
  if (!raw) return undefined;
  if (raw.geojson) return raw.geojson;
  if (raw.geoJson) return raw.geoJson;
  if (raw.geometry) return raw.geometry;
  if (raw.route?.geojson) return raw.route.geojson;
  if (raw.route?.geometry) return raw.route.geometry;
  if (raw.shape) return raw.shape;
  return undefined;
}

export async function syncDocAssets(options: SyncOptions = {}): Promise<SyncSummary> {
  const [tracksRaw, hutsRaw, campsitesRaw] = await Promise.all([
    fetchAll<any>("/tracks"),
    fetchAll<any>("/huts"),
    fetchAll<any>("/campsites"),
  ]);

  const trackItems = options.trackLimit
    ? tracksRaw.slice(0, options.trackLimit)
    : tracksRaw;

  let geojsonStored = 0;

  for (const raw of trackItems) {
    try {
      const normalized: NormalizedHike = toHike(raw);
      const docRef = firestore.collection("hikes").doc(normalized.docTrackId);
      const snapshot = await docRef.get();
      const timestamps = createTimestampPair(snapshot.exists ? snapshot.data() : undefined);

      let geojsonPath = normalized.geojsonPath;
      if (!geojsonPath) {
        const geometry = extractGeometry(raw);
        if (!geometry) {
          const detail = await fetchSingle<any>(`/tracks/${normalized.docTrackId}`);
          geojsonPath = await uploadGeoJson(
            normalized.docTrackId,
            extractGeometry(detail ?? raw)
          );
        } else {
          geojsonPath = await uploadGeoJson(normalized.docTrackId, geometry);
        }
        if (geojsonPath) {
          geojsonStored += 1;
        }
      }

      await docRef.set(
        {
          ...normalized,
          geojsonPath,
          createdAt: timestamps.createdAt,
          updatedAt: timestamps.updatedAt,
        },
        { merge: true }
      );
    } catch (error) {
      logger.error("Failed to sync DOC track", error);
    }
  }

  for (const raw of hutsRaw) {
    try {
      const normalized: NormalizedHut = toHut(raw);
      const docRef = firestore.collection("huts").doc(normalized.docHutId);
      const snapshot = await docRef.get();
      const timestamps = createTimestampPair(snapshot.exists ? snapshot.data() : undefined);

      await docRef.set(
        {
          ...normalized,
          createdAt: timestamps.createdAt,
          updatedAt: timestamps.updatedAt,
        },
        { merge: true }
      );
    } catch (error) {
      logger.error("Failed to sync DOC hut", error);
    }
  }

  for (const raw of campsitesRaw) {
    try {
      const normalized: NormalizedCampsite = toCampsite(raw);
      const docRef = firestore.collection("campsites").doc(normalized.docCampsiteId);
      const snapshot = await docRef.get();
      const timestamps = createTimestampPair(snapshot.exists ? snapshot.data() : undefined);

      await docRef.set(
        {
          ...normalized,
          createdAt: timestamps.createdAt,
          updatedAt: timestamps.updatedAt,
        },
        { merge: true }
      );
    } catch (error) {
      logger.error("Failed to sync DOC campsite", error);
    }
  }

  return {
    tracks: trackItems.length,
    huts: hutsRaw.length,
    campsites: campsitesRaw.length,
    geojsonStored,
  };
}
