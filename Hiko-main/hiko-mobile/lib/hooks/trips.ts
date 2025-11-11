import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createTrip, getTrip, listTrips, updateTrip } from "@/lib/services/trips";
import type { CreateTripInput, Trip, UpdateTripInput } from "@/lib/types";

export function useTrips(userId?: string) {
  return useQuery<Trip[]>({
    queryKey: ["trips", userId],
    queryFn: () => (userId ? listTrips(userId) : Promise.resolve([])),
    enabled: Boolean(userId),
  });
}

export function useTrip(id?: string) {
  return useQuery<Trip | null>({
    queryKey: ["trip", id],
    queryFn: () => (id ? getTrip(id) : Promise.resolve(null)),
    enabled: Boolean(id),
  });
}

export function useCreateTrip(userId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTripInput) => {
      if (!userId) throw new Error("User is required to create a trip");
      return createTrip(input, userId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["trips", userId] });
    },
  });
}

export function useUpdateTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: UpdateTripInput }) =>
      updateTrip(id, patch),
    onSuccess: async (_result, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["trip", variables.id] });
      await queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });
}
