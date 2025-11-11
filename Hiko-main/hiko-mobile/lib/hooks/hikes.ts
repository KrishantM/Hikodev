import { useQuery } from "@tanstack/react-query";

import type { HikeFilters } from "@/lib/schemas";
import type { Hike } from "@/lib/types";
import { getHike, getRouteGeoJson, listHikes } from "@/lib/services/hikes";

export function useHikes(filters: HikeFilters = {}) {
  return useQuery<Hike[]>({
    queryKey: ["hikes", filters],
    queryFn: () => listHikes(filters),
  });
}

export function useHike(id?: string) {
  return useQuery<Hike | null>({
    queryKey: ["hike", id],
    queryFn: () => (id ? getHike(id) : Promise.resolve(null)),
    enabled: Boolean(id),
  });
}

export function useHikeRouteGeoJson(id?: string) {
  return useQuery<string | null>({
    queryKey: ["hike-route", id],
    queryFn: () => (id ? getRouteGeoJson(id) : Promise.resolve(null)),
    enabled: Boolean(id),
  });
}
