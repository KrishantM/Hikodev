import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getUserProfile, upsertUserProfile } from "@/lib/services/users";
import type { UserProfile } from "@/lib/types";

export function useUserProfile(uid?: string) {
  return useQuery<UserProfile | null>({
    queryKey: ["user-profile", uid],
    queryFn: () => (uid ? getUserProfile(uid) : Promise.resolve(null)),
    enabled: Boolean(uid),
  });
}

export function useUpdateUserProfile(uid?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<UserProfile>) => {
      if (!uid) throw new Error("User ID required");
      return upsertUserProfile(uid, payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user-profile", uid] });
    },
  });
}
