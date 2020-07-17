// TODO make this into an actual provider so we can use it at arbitrary
// depths in the tree?
import { useState, useEffect } from "react";
import { dbFirebase } from "features/firebase";
import Config from "types/Config";

export const useConfig = (): Config => {
  const [config, setConfig] = useState<Config>({});
  useEffect(
    () =>
      dbFirebase.configObserver((config: Config | null) => {
        if (config) {
          setConfig(config);
        }
      }),
    []
  );
  return config;
};
