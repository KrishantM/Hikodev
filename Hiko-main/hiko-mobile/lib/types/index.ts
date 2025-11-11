import type {
  CampsiteDoc,
  DocAlertDoc,
  HikeDoc,
  HikeFilters,
  HutDoc,
  TripDoc,
  UserDoc,
} from "@/lib/schemas";

export type ExperienceLevel = UserDoc["experienceLevel"];
export type Difficulty = NonNullable<HikeDoc["difficulty"]>;
export type HikeStatus = NonNullable<HikeDoc["statusSummary"]>;
export type TripStatus = TripDoc["status"];
export type AlertSeverity = NonNullable<DocAlertDoc["severity"]>;

export type LatLng = HikeDoc["start"];

export interface Hike extends HikeDoc {
  id: string;
}

export interface Hut extends HutDoc {
  id: string;
}

export interface Campsite extends CampsiteDoc {
  id: string;
}

export interface DocAlert extends DocAlertDoc {
  id: string;
}

export interface Trip extends TripDoc {
  id: string;
}

export interface UserProfile extends UserDoc {
  id: string;
  savedHikes?: string[];
}

export interface CreateTripInput {
  hikeId: string;
  title: string;
  startDate: Date;
  endDate: Date;
  participants: string[];
  gearNeeded: string[];
  isOvernight: boolean;
}

export interface UpdateTripInput {
  title?: string;
  startDate?: Date;
  endDate?: Date;
  participants?: string[];
  gearNeeded?: string[];
  status?: TripStatus;
}

export type { HikeFilters };

export interface WeatherForecastDay {
  date: string;
  summary: string;
  tempMax: number;
  tempMin: number;
  windKph?: number;
  precipMm?: number;
  icon?: string;
  provider: "metservice" | "openweathermap";
  lastUpdated: string;
}

export interface WeatherCacheEntry {
  hikeId: string;
  lat: number;
  lng: number;
  data: WeatherForecastDay[];
  expiresAt: number;
}

export interface OfflineTripCache {
  trip: Trip;
  hike: Hike;
  routeGeoJson?: string;
  weather?: WeatherForecastDay[];
  cachedAt: number;
}
