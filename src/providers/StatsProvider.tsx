import React, { useState, useContext } from "react";
import { dbFirebase } from "features/firebase";
import Stats, { EMPTY_STATS } from "types/Stats";
import useAsyncEffect from "hooks/useAsyncEffect";

const StatsContext = React.createContext<Stats>(EMPTY_STATS);

type Props = { children: React.ElementType };

export default function StatsProvider({ children }: Props) {
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);
  useAsyncEffect(async () => {
    const stats = await dbFirebase.fetchStats();
    setStats(stats);
  }, []);

  return (
    <StatsContext.Provider value={stats}>{children}</StatsContext.Provider>
  );
}

export const useStats = () => useContext(StatsContext);
