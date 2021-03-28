import firebase from "firebase/app";

import User from "types/User";
import { gtagEvent, gtagSetId } from "gtag.js";

import dbFirebase from "./dbFirebase";
import { enableOrDisableFeatures } from "custom/featuresFlags";
import { addGravatarInfo } from "utils/gravatar";

const getProvider = (user: any) => {
  if (user.providerData.length > 0) {
    return user.providerData[0].providerId;
  }
  return null;
};

type Args = {
  onSignOut: () => void;
  setUser: (user?: User) => void;
};

export const onAuthStateChanged = ({ onSignOut, setUser }: Args) => {
  let userRef: any;

  const firebaseStatusChange = async (user: firebase.User | null) => {
    if (!user) {
      // if the user is signed in, then sign out
      if (userRef) {
        userRef = undefined;
        onSignOut();
        setUser(undefined);
      }
      return;
    }

    gtagSetId(user?.uid);
    gtagEvent("Logged in", "User", user?.uid);

    let currentUser = new User(
      user.uid,
      user.displayName || "",
      false,
      false,
      user.email || "",
      user.isAnonymous,
      user.phoneNumber || "",
      user.photoURL || "",
      "",
      null,
      "",
      getProvider(user)
    );

    addGravatarInfo(currentUser)

    setUser(currentUser);
    userRef = currentUser;

    try {
      const userFirebaseData = await dbFirebase.getUser(user.uid);
      currentUser = {
        ...currentUser,
        ...userFirebaseData
      };

      enableOrDisableFeatures(currentUser);
    } catch {}

    // creates a new object ref so react updates
    console.log(
      `calling setUser inside firebase status change for ${user.uid}`
    );
    setUser({ ...currentUser });
  };
  return firebase.auth().onAuthStateChanged(firebaseStatusChange);
};

export const signOut = async () => {
  await firebase.auth().signOut();
};

export const sendEmailVerification = () => {
  return firebase
    .auth()
    .currentUser?.sendEmailVerification()
    .then(() => {
      const message = {
        title: "Notification",
        body:
          "A verification link has been sent to email account: " +
          firebase.auth().currentUser?.email
      };
      return message;
    })
    .catch((error) => {
      return {
        title: "Warning",
        body: error.message
      };
    });
};
