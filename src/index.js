import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";

import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

// import { defineCustomElements } from '@ionic/pwa-elements/loader';

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import "./index.scss";
import App from "./App";

import { firebaseApp } from "features/firebase/firebaseInit";

import config from "./custom/config";
import { isIphoneAndCordova } from "./utils";
import { gtagInit } from "./gtag.js";
import LocationProvider, { useGPSLocation } from "./providers/LocationProvider";
import { usePhotos } from "./providers/PhotosProvider";
import SelectedFeatureProvider, {
  useSelectedFeature
} from "./providers/SelectedFeatureProvider";
import { useConfig } from "./providers/ConfigProvider";
import { useOnline } from "./providers/OnlineProvider";
import UserProvider, { useUser } from "./providers/UserProvider";
import StatsProvider from "./providers/StatsProvider";
import { dbFirebase } from "features/firebase";
import { MissionsProvider } from "./providers/MissionsProvider";

function initialiseCypressVars() {
  if (window.Cypress) {
    window.__firebase__ = firebaseApp;
  }
}

initialiseCypressVars();

if (isIphoneAndCordova) {
  window?.StatusBar?.styleDefault();
}

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
  const [{ geojson }, reloadPhotos] = usePhotos();
  const online = useOnline();
  const selectedFeature = useSelectedFeature();
  const { sponsorImage } = useConfig();
  const user = useUser();

  useEffect(() => {
    return () => dbFirebase.disconnect();
  }, []);

  return (
    <App
      config={config}
      gpsLocation={gpsLocation}
      geojson={geojson}
      reloadPhotos={reloadPhotos}
      online={online}
      sponsorImage={sponsorImage}
      selectedFeature={selectedFeature}
      user={user}
    />
  );
};

const startApp = () => {
  gtagInit();
  // TODO: crashslytics
  ReactDOM.render(
    <Router>
      <MuiThemeProvider theme={theme}>
        <LocationProvider>
          <SelectedFeatureProvider>
            <StatsProvider>
              <MissionsProvider>
                <UserProvider>
                  <Wrapper />
                </UserProvider>
              </MissionsProvider>
            </StatsProvider>
          </SelectedFeatureProvider>
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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();