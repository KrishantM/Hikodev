import { differenceInHours } from "date-fns";

import type { WeatherForecastDay, WeatherCacheEntry } from "@/lib/types";
import { getObject, setObject } from "@/lib/storage/mmkv";

const WEATHER_CACHE_PREFIX = "weather:";
const CACHE_TTL_HOURS = 12;

interface OpenWeatherResponse {
  list: Array<{
    dt_txt: string;
    main: { temp_min: number; temp_max: number };
    weather: Array<{ description: string; icon: string; main: string }>;
    wind?: { speed?: number };
    pop?: number;
    rain?: { [key: string]: number };
  }>;
}

async function fetchMetServiceForecast(
  _lat: number,
  _lng: number
): Promise<WeatherForecastDay[] | null> {
  // Placeholder for future MetService integration.
  return null;
}

async function fetchOpenWeatherForecast(
  lat: number,
  lng: number
): Promise<WeatherForecastDay[]> {
  const apiKey = process.env.EXPO_PUBLIC_OWM_API_KEY;
  if (!apiKey) {
    throw new Error("OpenWeatherMap API key not configured");
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`
  );

  if (!response.ok) {
    throw new Error(`OpenWeatherMap failed with ${response.status}`);
  }

  const data = (await response.json()) as OpenWeatherResponse;
  const grouped: Record<string, WeatherForecastDay> = {};

  for (const entry of data.list) {
    const date = entry.dt_txt.split(" ")[0];
    const key = date;
    const summary = entry.weather?.[0]?.main ?? "";
    const description = entry.weather?.[0]?.description ?? summary;
    const windKph = (entry.wind?.speed ?? 0) * 3.6; // m/s to km/h
    const precip = entry.rain?.["3h"] ?? 0;

    if (!grouped[key]) {
      grouped[key] = {
        date: key,
        summary: description || "Clear",
        tempMax: entry.main.temp_max,
        tempMin: entry.main.temp_min,
        windKph,
        precipMm: precip,
        icon: entry.weather?.[0]?.icon,
        provider: "openweathermap",
        lastUpdated: new Date().toISOString(),
      };
    } else {
      grouped[key].tempMax = Math.max(grouped[key].tempMax, entry.main.temp_max);
      grouped[key].tempMin = Math.min(grouped[key].tempMin, entry.main.temp_min);
      grouped[key].windKph = Math.max(grouped[key].windKph ?? 0, windKph);
      grouped[key].precipMm = (grouped[key].precipMm ?? 0) + precip;
      if (!grouped[key].icon && entry.weather?.[0]?.icon) {
        grouped[key].icon = entry.weather[0].icon;
      }
      grouped[key].summary = summary || grouped[key].summary;
    }
  }

  return Object.values(grouped)
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .slice(0, 3);
}

function getCacheKey(hikeId: string) {
  return `${WEATHER_CACHE_PREFIX}${hikeId}`;
}

function loadFromCache(hikeId: string): WeatherForecastDay[] | null {
  const cache = getObject<WeatherCacheEntry>(getCacheKey(hikeId));
  if (!cache) return null;
  const hours = differenceInHours(new Date(cache.expiresAt), new Date());
  if (hours <= 0) {
    return null;
  }
  return cache.data;
}

function saveToCache(
  hikeId: string,
  lat: number,
  lng: number,
  data: WeatherForecastDay[]
) {
  const expiresAt = Date.now() + CACHE_TTL_HOURS * 60 * 60 * 1000;
  const entry: WeatherCacheEntry = {
    hikeId,
    lat,
    lng,
    data: data.map((item) => ({ ...item, lastUpdated: new Date().toISOString() })),
    expiresAt,
  };
  setObject(getCacheKey(hikeId), entry);
}

export async function getForecast(
  hikeId: string,
  lat: number,
  lng: number
): Promise<WeatherForecastDay[]> {
  const cached = loadFromCache(hikeId);
  if (cached) {
    return cached;
  }

  const metservice = await fetchMetServiceForecast(lat, lng);
  if (metservice && metservice.length > 0) {
    saveToCache(hikeId, lat, lng, metservice);
    return metservice;
  }

  const openWeather = await fetchOpenWeatherForecast(lat, lng);
  saveToCache(hikeId, lat, lng, openWeather);
  return openWeather;
}
