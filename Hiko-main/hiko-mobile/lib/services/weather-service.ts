import { WeatherForecast } from "@/lib/types";
import { db } from "@/lib/firebase/config";
import {
  collection,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

interface WeatherProvider {
  getForecast(
    lat: number,
    lng: number,
    date?: Date
  ): Promise<WeatherForecast[]>;
}

class MetServiceProvider implements WeatherProvider {
  async getForecast(
    lat: number,
    lng: number,
    date?: Date
  ): Promise<WeatherForecast[]> {
    const apiKey = process.env.EXPO_PUBLIC_METSERVICE_API_KEY;
    if (!apiKey) {
      throw new Error("MetService API key not configured");
    }

    // TODO: Implement actual MetService API call
    // For now, return mock data
    return this.getMockForecast();
  }

  private getMockForecast(): WeatherForecast[] {
    const forecasts: WeatherForecast[] = [];
    for (let i = 0; i < 3; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      forecasts.push({
        date,
        tempMin: 8 + Math.random() * 5,
        tempMax: 15 + Math.random() * 8,
        condition: i === 0 ? "partly-cloudy" : "sunny",
        description: i === 0 ? "Partly cloudy" : "Sunny",
        windSpeed: 10 + Math.random() * 15,
        windDirection: Math.random() * 360,
        precipitation: i === 1 ? Math.random() * 5 : 0,
        humidity: 60 + Math.random() * 30,
      });
    }
    return forecasts;
  }
}

class OpenWeatherProvider implements WeatherProvider {
  async getForecast(
    lat: number,
    lng: number,
    date?: Date
  ): Promise<WeatherForecast[]> {
    const apiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
    if (!apiKey) {
      throw new Error("OpenWeather API key not configured");
    }

    // TODO: Implement actual OpenWeather API call
    return this.getMockForecast();
  }

  private getMockForecast(): WeatherForecast[] {
    const forecasts: WeatherForecast[] = [];
    for (let i = 0; i < 3; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      forecasts.push({
        date,
        tempMin: 8 + Math.random() * 5,
        tempMax: 15 + Math.random() * 8,
        condition: "sunny",
        description: "Clear sky",
        windSpeed: 10 + Math.random() * 15,
        windDirection: Math.random() * 360,
        precipitation: 0,
        humidity: 60 + Math.random() * 30,
      });
    }
    return forecasts;
  }
}

export class WeatherService {
  private primaryProvider: WeatherProvider;
  private fallbackProvider: WeatherProvider;

  constructor() {
    this.primaryProvider = new MetServiceProvider();
    this.fallbackProvider = new OpenWeatherProvider();
  }

  async getForecast(
    hikeId: string,
    lat: number,
    lng: number,
    date?: Date
  ): Promise<WeatherForecast[]> {
    // Check cache first
    const cacheKey = this.getCacheKey(hikeId, date);
    const cached = await this.getCachedForecast(cacheKey);

    if (cached && this.isCacheValid(cached)) {
      return cached.forecastJson;
    }

    // Fetch from provider
    let forecasts: WeatherForecast[];
    try {
      forecasts = await this.primaryProvider.getForecast(lat, lng, date);
    } catch (error) {
      console.warn("Primary weather provider failed, using fallback:", error);
      forecasts = await this.fallbackProvider.getForecast(lat, lng, date);
    }

    // Cache the result
    await this.setCachedForecast(cacheKey, hikeId, forecasts, "metservice");

    return forecasts;
  }

  private getCacheKey(hikeId: string, date?: Date): string {
    const dateStr = date
      ? date.toISOString().split("T")[0].replace(/-/g, "")
      : new Date().toISOString().split("T")[0].replace(/-/g, "");
    return `${hikeId}:${dateStr}`;
  }

  private async getCachedForecast(cacheKey: string) {
    if (!db) return null;
    try {
      const docRef = doc(db, "weatherCache", cacheKey);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          forecastJson: data.forecastJson as WeatherForecast[],
          fetchedAt: data.fetchedAt.toDate(),
          ttl: data.ttl.toDate(),
        };
      }
    } catch (error) {
      console.error("Error reading weather cache:", error);
    }
    return null;
  }

  private isCacheValid(cached: {
    fetchedAt: Date;
    ttl: Date;
  }): boolean {
    return new Date() < cached.ttl;
  }

  private async setCachedForecast(
    cacheKey: string,
    hikeId: string,
    forecasts: WeatherForecast[],
    provider: string
  ) {
    if (!db) return;
    try {
      const ttl = new Date();
      ttl.setHours(ttl.getHours() + 6); // Cache for 6 hours

      await setDoc(
        doc(db, "weatherCache", cacheKey),
        {
          hikeId,
          forecastJson: forecasts,
          provider,
          fetchedAt: new Date(),
          ttl,
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error caching weather:", error);
    }
  }
}

export const weatherService = new WeatherService();
