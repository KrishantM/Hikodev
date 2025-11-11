import { z } from "zod";

export const experienceLevelSchema = z.enum([
  "beginner",
  "intermediate",
  "advanced",
]);

export const difficultySchema = z.enum(["easy", "moderate", "hard"]).nullable();
export const hikeStatusSchema = z.enum([
  "open",
  "caution",
  "closed",
  "unknown",
]);

export const tripStatusSchema = z.enum([
  "planning",
  "active",
  "completed",
  "cancelled",
]);

export const alertSeveritySchema = z.enum(["info", "warning", "closed"]).optional();

export const latLngSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const userDocSchema = z.object({
  displayName: z.string().min(1),
  photoUrl: z.string().url().nullable().optional(),
  experienceLevel: experienceLevelSchema.default("beginner"),
  gearOwned: z.array(z.string()).default([]),
  savedHikes: z.array(z.string()).default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const hikeDocSchema = z.object({
  docTrackId: z.string(),
  name: z.string(),
  region: z.string(),
  start: latLngSchema,
  distanceKm: z.number().nonnegative(),
  elevationGainM: z.number().nonnegative().optional(),
  difficulty: difficultySchema,
  overnight: z.boolean(),
  tags: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  geojsonPath: z.string().optional(),
  statusSummary: hikeStatusSchema.optional(),
  lastOfficialStatusAt: z.date().optional(),
  lastUserStatusAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const hutDocSchema = z.object({
  docHutId: z.string(),
  name: z.string(),
  location: latLngSchema,
  capacity: z.number().nonnegative().optional(),
  facilities: z.array(z.string()).default([]),
  bookingUrl: z.string().url().optional(),
  updatedAt: z.date(),
});

export const campsiteDocSchema = z.object({
  docCampsiteId: z.string(),
  name: z.string(),
  location: latLngSchema,
  type: z.string().optional(),
  facilities: z.array(z.string()).default([]),
  bookingUrl: z.string().url().optional(),
  updatedAt: z.date(),
});

export const docAlertSchema = z.object({
  alertId: z.string(),
  sourceType: z.enum(["track", "hut", "campsite", "region"]),
  sourceId: z.string().optional(),
  title: z.string(),
  body: z.string(),
  severity: alertSeveritySchema,
  region: z.string().optional(),
  validFrom: z.date().optional(),
  validTo: z.date().optional(),
  updatedAt: z.date(),
});

export const tripDocSchema = z.object({
  hikeId: z.string(),
  createdBy: z.string(),
  title: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  participants: z.array(z.string()),
  gearNeeded: z.array(z.string()),
  status: tripStatusSchema,
  isOvernight: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const hikeFiltersSchema = z.object({
  region: z.string().optional(),
  difficulty: z.array(difficultySchema.unwrap()).optional(),
  overnight: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

export type UserDoc = z.infer<typeof userDocSchema>;
export type HikeDoc = z.infer<typeof hikeDocSchema>;
export type HutDoc = z.infer<typeof hutDocSchema>;
export type CampsiteDoc = z.infer<typeof campsiteDocSchema>;
export type DocAlertDoc = z.infer<typeof docAlertSchema>;
export type TripDoc = z.infer<typeof tripDocSchema>;
export type HikeFilters = z.infer<typeof hikeFiltersSchema>;
