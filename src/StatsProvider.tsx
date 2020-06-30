// TODO make this into an actual provider so we can use it at arbitrary
// depths in the tree?
import { useState } from "react";
import { dbFirebase } from "features/firebase";
import Stats, { EMPTY_STATS } from "types/Stats";
import { useAsyncEffect } from "utils";

export const useStats = (): Stats => {
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);
  useAsyncEffect(async () => {
    const stats = await dbFirebase.fetchStats();
    setStats(stats);
  }, []);
  return stats;
};
