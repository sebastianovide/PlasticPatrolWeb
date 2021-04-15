// TODO: convert it to typescript. Where should we put this file ?

import firebase from "firebase/app";
import { Plugins } from "@capacitor/core";

// https://github.com/capacitor-community/firebase-crashlytics
const { FirebaseCrashlytics } = Plugins;
let analytics;

export const gtagInit = () => {
  if (
    window.cordova &&
    window.cordova.plugins &&
    window.cordova.plugins.firebase
  ) {
    analytics = window.cordova.plugins.firebase.analytics;
    analytics.logEvent("type", {
      event_category: "Tech",
      event_label: "mobile",
      non_interaction: true
    });
  } else {
    analytics = firebase.analytics();
    analytics.logEvent("type", {
      event_category: "Tech",
      event_label: "web",
      non_interaction: true
    });
  }

  analytics.setCurrentScreen("/#");

  analytics.logEvent("app_version", {
    event_category: "Tech",
    event_label: String(process.env.REACT_APP_VERSION),
    non_interaction: true
  });

  analytics.logEvent("build_number", {
    event_category: "Tech",
    event_label: String(process.env.REACT_APP_BUILD_NUMBER),
    non_interaction: true
  });

  FirebaseCrashlytics.setEnabled({
    enabled: true,
  }).catch(console.info);

  FirebaseCrashlytics.addLogMessage({
    message: "started",
  }).catch(console.info);
};

export const gtagPageView = (pathname) => {
  analytics.setCurrentScreen("/#" + pathname);
  FirebaseCrashlytics.addLogMessage({
    message: `Current screen: "/# ${pathname}"`,
  }).catch(console.info)
};

export const gtagEvent = (
  name,
  category = null,
  label = null,
  non_interaction = false
) => {
  analytics.logEvent(String(name).replace(/ /g, "_"), {
    event_category: String(category),
    event_label: String(label),
    non_interaction: Boolean(non_interaction)
  });
};

export const gtagSetId = (id) => {
  analytics.setUserId(String(id));
  FirebaseCrashlytics.setUserId({
    userId: String(id)
  }).catch(console.info)
};
