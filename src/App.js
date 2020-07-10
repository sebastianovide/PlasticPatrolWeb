import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import _ from "lodash";
import { bufferTime } from "rxjs/operators";

import Snackbar from "@material-ui/core/Snackbar";
import { withStyles } from "@material-ui/core/styles";

import { Routes } from "routes/Routes";

import { dbFirebase, authFirebase } from "features/firebase";
import { linkToNewPhoto } from "routes/photo/routes/new/links";
import getMapIsVisible from "utils/getMapIsVisible";
import {
  linkToLoginWithRedirectOnSuccess,
  linkToLogin
} from "routes/login/links";

import WelcomePage from "./components/pages/WelcomePage";
import Map from "./components/MapPage/Map";
import DrawerContainer from "./components/DrawerContainer";
import TermsDialog from "./components/TermsDialog";
import EmailVerifiedDialog from "./pages/dialogs/EmailVerified";
import MapLocation from "./types/MapLocation";
import config from "./custom/config";
import { extractPathnameParams } from "PhotosProvider";

import { gtagPageView, gtagEvent } from "./gtag.js";
import "./App.scss";

const styles = (theme) => ({
  rootDialog: {
    padding: theme.spacing(2),
    margin: 0
  },
  dialogClose: {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1)
  }
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      leftDrawerOpen: false,
      mapLocation: new MapLocation()
    };

    this.domRefInput = {};
  }

  async componentDidMount() {
    let { mapLocation } = extractPathnameParams(this.props.location);
    this.setState({ mapLocation });
  }

  async componentWillUnmount() {
    // Terrible hack !!! it will be fixed with redux
    this.setState = console.log;
  }

  handleCameraClick = () => {
    if (config.SECURITY.UPLOAD_REQUIRES_LOGIN && !this.state.user) {
      this.props.history.push(
        linkToLoginWithRedirectOnSuccess(linkToNewPhoto())
      );
    } else {
      this.props.history.push(linkToNewPhoto());
    }
  };

  toggleLeftDrawer = (isItOpen) => () => {
    gtagEvent(isItOpen ? "Opened" : "Closed", "Menu");
    this.setState({ leftDrawerOpen: isItOpen });
  };

  handleNextClick = async () => {
    const user = await authFirebase.reloadUser();
    if (authFirebase.shouldConsiderEmailVerified(user)) {
      this.setState({
        user: {
          ...this.state.user,

          emailVerified: authFirebase.shouldConsiderEmailVerified(user)
        }
      });
      let message = {
        title: "Confirmation",
        body: "Thank you for verifying your email."
      };
      return message;
    } else {
      let message = {
        title: "Warning",
        body:
          "Email not verified yet. Please click the link in the email we sent you."
      };
      return message;
    }
  };

  handleMapLocationChange = (mapLocation) => {
    if (!getMapIsVisible(this.props.history.location.pathname)) {
      return;
    }

    const currentUrl = this.props.history.location;
    const prefix = currentUrl.pathname.split("@")[0];
    const newUrl = `${prefix}@${mapLocation.urlFormated()}`;

    this.props.history.replace(newUrl);
    this.setState({ mapLocation });
  };

  handleLocationClick = () => {
    gtagEvent("Location FAB clicked", "Map");
    const { latitude, longitude } = this.props.gpsLocation;
    this.setState({
      mapLocation: new MapLocation(
        latitude,
        longitude,
        this.state.mapLocation.zoom
      )
    });
  };

  handlePhotoClick = (feature) => {
    const { history } = this.props;

    let pathname = `${config.PAGES.displayPhoto.path}/${feature.properties.id}`;
    const currentPath = history.location.pathname;

    const coordsUrl =
      currentPath.split("@")[1] ||
      new MapLocation(
        feature.geometry.coordinates[1],
        feature.geometry.coordinates[0],
        config.ZOOM_FLYTO
      ).urlFormated();
    pathname =
      currentPath === config.PAGES.embeddable.path
        ? currentPath + pathname
        : pathname;

    // if it is in map, change the url
    if (getMapIsVisible(history.location.pathname)) {
      history.replace(`${currentPath.split("@")[0]}@${coordsUrl}`);
    }

    history.push(`${pathname}@${coordsUrl}`);
  };

  handleClickLoginLogout = () => {
    if (this.props.user) {
      authFirebase.signOut();
    } else {
      this.props.history.push(linkToLogin());
    }
  };

  render() {
    const {
      user,
      history,
      gpsLocation,
      geojson,
      online,
      stats,
      sponsorImage,
      selectedFeature
    } = this.props;
    const { leftDrawerOpen, mapLocation } = this.state;
    return (
      <div className="geovation-app">
        <TermsDialog />
        <EmailVerifiedDialog
          user={user}
          open={!!(user && !authFirebase.shouldConsiderEmailVerified(user))}
          handleNextClick={this.handleNextClick}
        />

        <main className="content">
          <WelcomePage />
          <Map
            history={history}
            visible={getMapIsVisible(history.location.pathname)}
            geojson={geojson}
            user={user}
            config={config}
            embeddable={history.location.pathname.match(
              new RegExp(config.PAGES.embeddable.path, "g")
            )}
            handleCameraClick={this.handleCameraClick}
            toggleLeftDrawer={this.toggleLeftDrawer}
            handlePhotoClick={this.handlePhotoClick}
            mapLocation={mapLocation}
            handleMapLocationChange={(newMapLocation) =>
              this.handleMapLocationChange(newMapLocation)
            }
            handleLocationClick={this.handleLocationClick}
            gpsOffline={!gpsLocation.online}
            gpsDisabled={!gpsLocation.updated}
          />
          <Routes
            user={user}
            stats={stats}
            gpsLocation={gpsLocation}
            online={online}
            geojson={geojson}
            reloadPhotos={this.reloadPhotos}
            handlePhotoClick={this.handlePhotoClick}
            selectedFeature={selectedFeature}
            sponsorImage={sponsorImage}
          />
        </main>

        <Snackbar open={!geojson} message="Loading photos..." />

        <DrawerContainer
          user={user}
          online={online}
          handleClickLoginLogout={this.handleClickLoginLogout}
          leftDrawerOpen={leftDrawerOpen}
          toggleLeftDrawer={this.toggleLeftDrawer}
          stats={stats}
          sponsorImage={sponsorImage}
        />
      </div>
    );
  }
}

export default withRouter(withStyles(styles, { withTheme: true })(App));
