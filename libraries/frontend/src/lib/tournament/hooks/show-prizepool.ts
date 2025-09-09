import { TournamentData } from "@declarations/tournament_canister/tournament_canister.did";
import { useMemo } from "react";
import { useIsTournamentRunning } from "./is-running";

export const useShowPrizepool = (data?: Pick<TournamentData, 'current_players' | 'state' | 'start_time'>) => {
  const isRunning = useIsTournamentRunning(data);

  return useMemo(() => data && (isRunning || data?.current_players.length >= 10), [isRunning, data?.current_players.length]);
}