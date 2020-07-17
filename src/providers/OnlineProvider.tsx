// TODO make this into an actual provider so we can use it at arbitrary
// depths in the tree?
import { useState, useEffect } from "react";
import { dbFirebase } from "features/firebase";

export const useOnline = () => {
  const [online, setOnline] = useState(false);
  useEffect(
    () =>
      dbFirebase.onConnectionStateChanged((online) => {
        setOnline(online);
      }),
    []
  );
  return online;
};
