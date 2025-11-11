import type { Hike, OfflineTripCache, Trip, WeatherForecastDay } from "@/lib/types";
import { getObject, removeItem, setObject } from "./mmkv";

const OFFLINE_TRIP_PREFIX = "offline:trip:";

function cacheKey(tripId: string) {
  return `${OFFLINE_TRIP_PREFIX}${tripId}`;
}

export function saveTripOfflineCache(
  trip: Trip,
  hike: Hike,
  options: { routeGeoJson?: string; weather?: WeatherForecastDay[] }
) {
  const entry: OfflineTripCache = {
    trip,
    hike,
    routeGeoJson: options.routeGeoJson,
    weather: options.weather,
    cachedAt: Date.now(),
  };
  setObject(cacheKey(trip.id), entry);
}

export function getTripOfflineCache(tripId: string): OfflineTripCache | undefined {
  return getObject<OfflineTripCache>(cacheKey(tripId));
}

export function clearTripOfflineCache(tripId: string) {
  removeItem(cacheKey(tripId));
}

export function isTripOfflineReady(tripId: string): boolean {
  const cached = getTripOfflineCache(tripId);
  return Boolean(cached && cached.routeGeoJson && cached.weather);
}
