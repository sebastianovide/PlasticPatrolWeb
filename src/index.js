import React, { useState } from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";
import * as firebaseui from "firebaseui";
import firebase from "firebase/app";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import "./index.scss";
import App from "./App";

import firebaseApp from "features/firebase/firebaseInit";

import LoginFirebase from "./components/LoginFirebase";
import * as serviceWorker from "./serviceWorker";
import config from "./custom/config";
import { isIphoneAndCordova } from "./utils";
import { gtagInit } from "./gtag.js";
import LocationProvider, { useGPSLocation } from "./LocationProvider";
import { useOnline } from "./OnlineProvider";
import * as Sentry from "@sentry/browser";

if (process.env.NODE_ENV !== "development") {
  Sentry.init({
    dsn:
      "https://41de3daa1d7542bd8c9204365283e1b2@o404007.ingest.sentry.io/5267230"
  });
}

serviceWorker.register();

function initialiseCypressVars() {
  if (window.Cypress) {
    console.log("adding firebase");
    window.__firebase__ = firebaseApp;
  }
}

initialiseCypressVars();

if (isIphoneAndCordova) {
  window.StatusBar.styleDefault();
}

const isPendingRedirect = () => {
  const app =
    firebaseui.auth.AuthUI.getInstance() ||
    new firebaseui.auth.AuthUI(firebase.auth());
  return app.isPendingRedirect();
};

if (
  process.env.NODE_ENV !== "development" &&
  localStorage.getItem("debug") !== "true"
) {
  console.log = console.info = console.trace = console.warn = console.error = console.debug = (
    _
  ) => {};
}
// it must set to fals (not enough to be absent)
const devDissableDebugLog = localStorage.getItem("debug") === "false";
if (devDissableDebugLog) {
  console.debug = (_) => {};
}

const theme = createMuiTheme(config.THEME);

const Wrapper = () => {
  const gpsLocation = useGPSLocation();
  const photos = usePhotos();
  const online = useOnline();
  const stats = useStats();

  const [handledPendingRedirect, setHandledPendingRedirect] = useState(false);
  return (
    <>
      <LoginFirebase
        open={!handledPendingRedirect && isPendingRedirect()}
        handleClose={() => {}}
        onSignIn={() => setHandledPendingRedirect(true)}
      />
      <App
        config={config}
        gpsLocation={gpsLocation}
        photos={photos}
        online={online}
      />
    </>
  );
};

const startApp = () => {
  gtagInit();

  ReactDOM.render(
    <Router>
      <MuiThemeProvider theme={theme}>
        <LocationProvider>
          <Wrapper />
        </LocationProvider>
      </MuiThemeProvider>
    </Router>,
    document.getElementById("root")
  );
};

if (!window.cordova) {
  startApp();
} else {
  document.addEventListener("deviceready", startApp, false);
}
