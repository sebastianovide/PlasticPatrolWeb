// TODO make this into an actual provider so we can use it at arbitrary
// depths in the tree?
import { useState, useEffect, useCallback } from "react";
import { authFirebase } from "features/firebase";
import User from "types/User";
import { gtagEvent } from "gtag";
import config from "custom/config";
import { useHistory } from "react-router-dom";

export const useUser = (): User | undefined => {
  const [user, setUser] = useState<User>();
  const history = useHistory();
  const authStateChangedCallback = useCallback(
    (newUser) => {
      if (user && !newUser) {
        gtagEvent("Signed out", "User");

        history.push(config.PAGES.map.path);
        window.location.reload();
      }
      setUser(newUser);
    },
    [user, history]
  );
  useEffect(
    () => authFirebase.onAuthStateChanged(authStateChangedCallback),
    []
  );
  return user;
};
