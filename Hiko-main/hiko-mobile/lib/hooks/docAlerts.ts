import { useQuery } from "@tanstack/react-query";

import { listAlertsByRegion, listAlertsForTrack } from "@/lib/services/docAlerts";
import type { DocAlert } from "@/lib/types";

export function useTrackAlerts(trackId?: string) {
  return useQuery<DocAlert[]>({
    queryKey: ["doc-alerts", trackId],
    queryFn: () => (trackId ? listAlertsForTrack(trackId) : Promise.resolve([])),
    enabled: Boolean(trackId),
  });
}

export function useRegionAlerts(region?: string) {
  return useQuery<DocAlert[]>({
    queryKey: ["doc-region-alerts", region],
    queryFn: () => (region ? listAlertsByRegion(region) : Promise.resolve([])),
    enabled: Boolean(region),
  });
}
