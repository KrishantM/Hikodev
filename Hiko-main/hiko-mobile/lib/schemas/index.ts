import { z } from "zod";

// User Schemas
export const experienceLevelSchema = z.enum([
  "beginner",
  "intermediate",
  "advanced",
]);

export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  photoUrl: z.string().url().optional(),
  bio: z.string().max(500).optional(),
  experienceLevel: experienceLevelSchema.optional(),
  gearOwned: z.array(z.string()).optional(),
  friends: z.array(z.string()).default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Hike Schemas
export const difficultySchema = z.enum(["easy", "moderate", "hard"]);
export const trackStatusSchema = z.enum([
  "open",
  "caution",
  "closed",
  "unknown",
]);

export const latLngSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const hikeSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  region: z.string().min(1),
  startLatLng: latLngSchema,
  endLatLng: latLngSchema.optional(),
  distanceKm: z.number().positive(),
  elevationGainM: z.number().nonnegative().optional(),
  difficulty: difficultySchema,
  features: z.array(z.string()),
  overnight: z.boolean(),
  tags: z.array(z.string()),
  docTrackId: z.string().optional(),
  mapPreviewTileUrl: z.string().url().optional(),
  geojsonPath: z.string().optional(),
  statusSummary: trackStatusSchema.optional(),
  lastOfficialStatusAt: z.date().optional(),
  lastUserStatusAt: z.date().optional(),
});

// Trip Schemas
export const tripStatusSchema = z.enum([
  "planning",
  "active",
  "completed",
  "cancelled",
]);

export const tripSchema = z.object({
  id: z.string(),
  hikeId: z.string(),
  createdBy: z.string(),
  title: z.string().min(1),
  startDate: z.date(),
  endDate: z.date(),
  participants: z.array(z.string()).min(1),
  gearNeeded: z.array(z.string()).default([]),
  status: tripStatusSchema,
  isOvernight: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createTripSchema = z.object({
  hikeId: z.string().min(1),
  title: z.string().min(1),
  startDate: z.date(),
  endDate: z.date(),
  participants: z.array(z.string()).min(1),
  gearNeeded: z.array(z.string()).optional(),
  isOvernight: z.boolean(),
});

// Weather Schemas
export const weatherForecastSchema = z.object({
  date: z.date(),
  tempMin: z.number(),
  tempMax: z.number(),
  condition: z.string(),
  description: z.string(),
  windSpeed: z.number().optional(),
  windDirection: z.number().optional(),
  precipitation: z.number().optional(),
  humidity: z.number().optional(),
});

// Filter Schemas
export const hikeFiltersSchema = z.object({
  difficulty: z.array(difficultySchema).optional(),
  maxDistance: z.number().positive().optional(),
  maxDrivingTime: z.number().positive().optional(),
  features: z.array(z.string()).optional(),
  overnight: z.boolean().optional(),
  region: z.string().optional(),
  search: z.string().optional(),
});
