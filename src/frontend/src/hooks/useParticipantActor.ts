/**
 * Hook for participant-facing screens.
 * Creates a plain anonymous actor WITHOUT calling _initializeAccessControlWithSecret,
 * which would fail for anonymous callers and block all participant operations.
 */
import { useQuery } from "@tanstack/react-query";
import type { backendInterface } from "../backend";
import { createActorWithConfig } from "../config";

export function useParticipantActor() {
  const actorQuery = useQuery<backendInterface>({
    queryKey: ["participant-actor"],
    queryFn: async () => {
      // Anonymous actor only — no access control initialization needed
      return await createActorWithConfig();
    },
    staleTime: Number.POSITIVE_INFINITY,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });

  return {
    actor: actorQuery.data ?? null,
    isFetching: actorQuery.isFetching,
    isError: actorQuery.isError,
  };
}
