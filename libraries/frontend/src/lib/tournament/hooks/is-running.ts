import { TournamentData } from "@declarations/tournament_canister/tournament_canister.did";
import { DateToBigIntTimestamp } from "@zk-game-dao/ui";
import { useEffect, useMemo, useState } from "react";

export const useIsTournamentRunning = (data?: Pick<TournamentData, 'state' | 'start_time'>) => {
  const [currentTime, setCurrentTime] = useState(DateToBigIntTimestamp(new Date()));

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(DateToBigIntTimestamp(new Date())), 10000);
    return () => clearInterval(interval);
  }, []);

  return useMemo(() => {
    if (!data || 'Registration' in data.state) return false;
    return currentTime > data.start_time;
  }, [currentTime, data]);
};
