import { useQuery } from "@tanstack/react-query";

import { getForecast } from "@/lib/services/weather";
import type { WeatherForecastDay } from "@/lib/types";

export function useWeather(
  hikeId?: string,
  coordinates?: { lat: number; lng: number }
) {
  return useQuery<WeatherForecastDay[]>({
    queryKey: ["weather", hikeId, coordinates?.lat, coordinates?.lng],
    queryFn: () =>
      hikeId && coordinates
        ? getForecast(hikeId, coordinates.lat, coordinates.lng)
        : Promise.resolve([]),
    enabled: Boolean(hikeId && coordinates),
  });
}
