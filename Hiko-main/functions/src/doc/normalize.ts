import { z } from "zod";

export const difficultySchema = z
  .union([z.literal("easy"), z.literal("moderate"), z.literal("hard")])
  .nullable();

export type Difficulty = z.infer<typeof difficultySchema>;

export interface NormalizedHike {
  docTrackId: string;
  name: string;
  region: string;
  start: { lat: number; lng: number };
  distanceKm: number;
  elevationGainM?: number;
  difficulty: Difficulty;
  overnight: boolean;
  tags: string[];
  features: string[];
  geojsonPath?: string;
  statusSummary?: "open" | "caution" | "closed" | "unknown";
  lastOfficialStatusAt?: Date;
  lastUserStatusAt?: Date;
}

export interface NormalizedHut {
  docHutId: string;
  name: string;
  location: { lat: number; lng: number };
  capacity?: number;
  facilities: string[];
  bookingUrl?: string;
}

export interface NormalizedCampsite {
  docCampsiteId: string;
  name: string;
  location: { lat: number; lng: number };
  type?: string;
  facilities: string[];
  bookingUrl?: string;
}

export interface NormalizedAlert {
  alertId: string;
  sourceType: "track" | "hut" | "campsite" | "region";
  sourceId?: string;
  title: string;
  body: string;
  severity?: "info" | "warning" | "closed";
  region?: string;
  validFrom?: Date;
  validTo?: Date;
}

const numberSchema = z
  .union([z.number(), z.string()])
  .transform((value) => (typeof value === "number" ? value : Number(value)))
  .refine((value) => !Number.isNaN(value), {
    message: "Invalid number",
  });

function extractCoordinates(raw: any): { lat: number; lng: number } | null {
  const lat = raw?.lat ?? raw?.latitude ?? raw?.y ?? raw?.[1];
  const lng = raw?.lng ?? raw?.lon ?? raw?.longitude ?? raw?.x ?? raw?.[0];
  if (typeof lat === "number" && typeof lng === "number") {
    return { lat, lng };
  }
  if (typeof lat === "string" && typeof lng === "string") {
    const parsedLat = Number(lat);
    const parsedLng = Number(lng);
    if (!Number.isNaN(parsedLat) && !Number.isNaN(parsedLng)) {
      return { lat: parsedLat, lng: parsedLng };
    }
  }
  return null;
}

function parseDifficulty(value: any): Difficulty {
  if (typeof value !== "string") {
    return null;
  }
  const normalized = value.trim().toLowerCase();
  if (["easy", "easi", "beginner"].includes(normalized)) return "easy";
  if (["moderate", "medium", "intermediate"].includes(normalized)) {
    return "moderate";
  }
  if (["hard", "advanced", "difficult"].includes(normalized)) return "hard";
  return null;
}

function parseStatus(value: any): "open" | "caution" | "closed" | "unknown" {
  if (typeof value !== "string") return "unknown";
  const normalized = value.toLowerCase();
  if (normalized.includes("open")) return "open";
  if (normalized.includes("caution") || normalized.includes("alert")) {
    return "caution";
  }
  if (normalized.includes("close")) return "closed";
  return "unknown";
}

function asDate(value: any): Date | undefined {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function toHike(raw: any): NormalizedHike {
  if (!raw) {
    throw new Error("Cannot normalize empty DOC track");
  }

  const id = String(
    raw.id ?? raw.trackId ?? raw.assetId ?? raw.externalId ?? raw.reference ?? ""
  ).trim();
  if (!id) {
    throw new Error("DOC track missing identifier");
  }

  const name = String(raw.name ?? raw.title ?? "Unnamed track").trim();
  const region =
    String(raw.region ?? raw.place ?? raw.area ?? "Unknown region").trim();

  const startCoordinates =
    extractCoordinates(raw.startPoint) ??
    extractCoordinates(raw.start) ??
    extractCoordinates(raw.location) ??
    extractCoordinates(raw.geometry?.coordinates?.[0]?.[0]) ??
    extractCoordinates(raw.coordinates?.[0]) ??
    extractCoordinates(raw.centroid);

  if (!startCoordinates) {
    throw new Error(`DOC track ${id} missing WGS84 coordinates`);
  }

  const distanceRaw = raw.length ?? raw.lengthKm ?? raw.distance ?? raw.distanceKm ?? 0;
  let parsedDistance = numberSchema.parse(distanceRaw);
  if (typeof distanceRaw === "string") {
    const lower = distanceRaw.toLowerCase();
    if (lower.includes("km")) {
      const sanitized = lower.replace(/[^0-9.,-]/g, "").replace(/,/, ".");
      parsedDistance = numberSchema.parse(sanitized);
    } else if (lower.includes("m")) {
      const sanitized = lower.replace(/[^0-9.,-]/g, "").replace(/,/, ".");
      parsedDistance = numberSchema.parse(sanitized) / 1000;
    }
  }

  const elevation = raw.elevationGain ?? raw.climb ?? raw.ascent ?? raw.elevationGainM;
  const parsedElevation =
    elevation === undefined ? undefined : numberSchema.parse(elevation);

  const difficulty = parseDifficulty(raw.difficulty ?? raw.grade ?? raw.level);

  const overnight = Boolean(
    raw.overnight ?? raw.multiDay ?? raw.multi_day ?? raw.isMultiDay ?? false
  );

  const tags = Array.isArray(raw.tags)
    ? raw.tags.map((tag: any) => String(tag).trim()).filter(Boolean)
    : [];

  const features = Array.isArray(raw.features)
    ? raw.features.map((feature: any) => String(feature).trim()).filter(Boolean)
    : [];

  const statusSummary = parseStatus(raw.status ?? raw.alertLevel ?? raw.state);

  return {
    docTrackId: id,
    name,
    region,
    start: startCoordinates,
    distanceKm: Number(parsedDistance.toFixed(2)),
    elevationGainM:
      parsedElevation === undefined ? undefined : Math.round(parsedElevation),
    difficulty,
    overnight,
    tags,
    features,
    statusSummary,
    lastOfficialStatusAt: asDate(raw.lastUpdated ?? raw.updatedAt),
  };
}

export function toHut(raw: any): NormalizedHut {
  if (!raw) {
    throw new Error("Cannot normalize empty DOC hut");
  }

  const id = String(raw.id ?? raw.hutId ?? raw.assetId ?? raw.reference ?? "").trim();
  if (!id) {
    throw new Error("DOC hut missing identifier");
  }

  const location =
    extractCoordinates(raw.location) ??
    extractCoordinates(raw.centroid) ??
    extractCoordinates(raw.coordinates);

  if (!location) {
    throw new Error(`DOC hut ${id} missing WGS84 coordinates`);
  }

  const capacity = raw.capacity ?? raw.beds ?? raw.sleepCapacity;
  const facilities = Array.isArray(raw.facilities)
    ? raw.facilities.map((f: any) => String(f).trim()).filter(Boolean)
    : [];

  return {
    docHutId: id,
    name: String(raw.name ?? raw.title ?? "Unnamed hut").trim(),
    location,
    capacity:
      capacity === undefined ? undefined : Math.round(numberSchema.parse(capacity)),
    facilities,
    bookingUrl: raw.bookingUrl ?? raw.booking_link ?? raw.url ?? undefined,
  };
}

export function toCampsite(raw: any): NormalizedCampsite {
  if (!raw) {
    throw new Error("Cannot normalize empty DOC campsite");
  }

  const id = String(
    raw.id ?? raw.campsiteId ?? raw.assetId ?? raw.reference ?? ""
  ).trim();
  if (!id) {
    throw new Error("DOC campsite missing identifier");
  }

  const location =
    extractCoordinates(raw.location) ??
    extractCoordinates(raw.centroid) ??
    extractCoordinates(raw.coordinates);

  if (!location) {
    throw new Error(`DOC campsite ${id} missing WGS84 coordinates`);
  }

  const facilities = Array.isArray(raw.facilities)
    ? raw.facilities.map((f: any) => String(f).trim()).filter(Boolean)
    : [];

  return {
    docCampsiteId: id,
    name: String(raw.name ?? raw.title ?? "Unnamed campsite").trim(),
    location,
    type: raw.type ?? raw.category ?? raw.siteType ?? undefined,
    facilities,
    bookingUrl: raw.bookingUrl ?? raw.booking_link ?? raw.url ?? undefined,
  };
}

export function toAlert(raw: any): NormalizedAlert {
  if (!raw) {
    throw new Error("Cannot normalize empty DOC alert");
  }

  const id = String(raw.id ?? raw.alertId ?? raw.reference ?? "").trim();
  if (!id) {
    throw new Error("DOC alert missing identifier");
  }

  const sourceType = ((): NormalizedAlert["sourceType"] => {
    const type = String(raw.sourceType ?? raw.type ?? "track").toLowerCase();
    if (type.includes("hut")) return "hut";
    if (type.includes("camp")) return "campsite";
    if (type.includes("region")) return "region";
    return "track";
  })();

  const severity = ((): NormalizedAlert["severity"] => {
    const level = String(raw.severity ?? raw.level ?? raw.status ?? "").toLowerCase();
    if (!level) return undefined;
    if (level.includes("close")) return "closed";
    if (level.includes("warn") || level.includes("caution")) return "warning";
    if (level.includes("info")) return "info";
    return undefined;
  })();

  return {
    alertId: id,
    sourceType,
    sourceId: raw.sourceId ?? raw.assetId ?? raw.trackId ?? raw.relatedId,
    title: String(raw.title ?? raw.name ?? "DOC alert").trim(),
    body: String(raw.body ?? raw.description ?? raw.details ?? "").trim(),
    severity,
    region: raw.region ?? raw.area ?? undefined,
    validFrom: asDate(raw.validFrom ?? raw.startDate),
    validTo: asDate(raw.validTo ?? raw.endDate),
  };
}
