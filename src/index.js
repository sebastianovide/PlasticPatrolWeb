import React, { useState } from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import "./index.scss";
import App from "./App";
import * as firebaseui from "firebaseui";
import firebase from "firebase/app";
import LoginFirebase from "./components/LoginFirebase";
import * as serviceWorker from "./serviceWorker";
import config from "./custom/config";
import { isIphoneAndCordova } from "./utils";
import { gtagInit } from "./gtag.js";
import LocationProvider from "./LocationProvider";

serviceWorker.register();

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
  const [handledPendingRedirect, setHandledPendingRedirect] = useState(false);
  return (
    <>
      <LoginFirebase
        open={!handledPendingRedirect && isPendingRedirect()}
        handleClose={() => {}}
        onSignIn={() => setHandledPendingRedirect(true)}
      />
      <LocationProvider>
        <App config={config} />
      </LocationProvider>
    </>
  );
};

const startApp = () => {
  gtagInit();

  ReactDOM.render(
    <Router>
      <MuiThemeProvider theme={theme}>
        <Wrapper />
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
