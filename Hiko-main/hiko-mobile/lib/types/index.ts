// User Types
export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  bio?: string;
  experienceLevel?: ExperienceLevel;
  gearOwned?: string[];
  friends: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Hike Types
export type Difficulty = "easy" | "moderate" | "hard";
export type TrackStatus = "open" | "caution" | "closed" | "unknown";

export interface Hike {
  id: string;
  name: string;
  region: string;
  startLatLng: { lat: number; lng: number };
  endLatLng?: { lat: number; lng: number };
  distanceKm: number;
  elevationGainM?: number;
  difficulty: Difficulty;
  features: string[];
  overnight: boolean;
  tags: string[];
  docTrackId?: string;
  mapPreviewTileUrl?: string;
  geojsonPath?: string;
  statusSummary?: TrackStatus;
  lastOfficialStatusAt?: Date;
  lastUserStatusAt?: Date;
}

// Hut Types
export interface Hut {
  id: string;
  name: string;
  locationLatLng: { lat: number; lng: number };
  capacity?: number;
  facilities?: string[];
  bookingUrl?: string;
  docHutId?: string;
}

// Trip Types
export type TripStatus = "planning" | "active" | "completed" | "cancelled";

export interface Trip {
  id: string;
  hikeId: string;
  createdBy: string;
  title: string;
  startDate: Date;
  endDate: Date;
  participants: string[];
  gearNeeded: string[];
  status: TripStatus;
  isOvernight: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Trip Message Types
export interface TripMessage {
  id: string;
  tripId: string;
  userId: string;
  message: string;
  createdAt: Date;
}

// Track Status Report Types
export type StatusReportType = "official" | "user";
export type StatusSource = "DOC" | "user";

export interface TrackStatusReport {
  id: string;
  hikeId: string;
  type: StatusReportType;
  summary: string;
  conditions?: string[];
  hazards?: string[];
  source?: StatusSource;
  createdBy?: string;
  createdAt: Date;
}

// Weather Types
export interface WeatherForecast {
  date: Date;
  tempMin: number;
  tempMax: number;
  condition: string;
  description: string;
  windSpeed?: number;
  windDirection?: number;
  precipitation?: number;
  humidity?: number;
}

export interface WeatherCache {
  id: string;
  hikeId: string;
  forecastJson: WeatherForecast[];
  provider: string;
  fetchedAt: Date;
  ttl: Date;
}

// Feature Flags
export interface FeatureFlags {
  FEATURE_DOC: boolean;
  FEATURE_CHAT: boolean;
  FEATURE_GPS_EXPERIMENTAL: boolean;
  FEATURE_RENTALS_STUB: boolean;
}

// Filter Types
export interface HikeFilters {
  difficulty?: Difficulty[];
  maxDistance?: number;
  maxDrivingTime?: number;
  features?: string[];
  overnight?: boolean;
  region?: string;
  search?: string;
}

// Service Input Types
export interface CreateTripInput {
  hikeId: string;
  title: string;
  startDate: Date;
  endDate: Date;
  participants: string[];
  gearNeeded?: string[];
  isOvernight: boolean;
}
