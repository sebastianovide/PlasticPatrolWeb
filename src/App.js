import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import * as localforage from "localforage";
import _ from "lodash";

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
import { EMPTY_STATS } from "./types/Stats";

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
      location: new MapLocation(), // from GPS
      mapLocation: new MapLocation(), // from the map
      user: null,
      online: false,
      leftDrawerOpen: false,
      geojson: null,
      stats: undefined,
      selectedFeature: undefined, // undefined = not selectd, null = feature not found
      photoAccessedByUrl: false,
      // comes from config
      sponsorImage: undefined
    };

    this.geoid = null;
    this.domRefInput = {};
    this.featuresDict = {};
  }

  async fetchPhotoIfUndefined(photoId) {
    // it means that we landed on the app with a photoId in the url
    if (photoId && !this.state.selectedFeature) {
      return dbFirebase
        .getPhotoByID(photoId)
        .then((selectedFeature) => this.setState({ selectedFeature }))
        .catch((e) => this.setState({ selectedFeature: null }));
    }
  }

  extractPathnameParams() {
    // extracts photoID
    const regexPhotoIDMatch = this.props.location.pathname.match(
      new RegExp(`${this.props.config.PAGES.displayPhoto.path}\\/(\\w+)`)
    );

    const photoId = regexPhotoIDMatch && regexPhotoIDMatch[1];

    // extracts mapLocation
    const regexMapLocationMatch = this.props.location.pathname.match(
      new RegExp("@(-?\\d*\\.?\\d*),(-?\\d*\\.?\\d*),(\\d*\\.?\\d*)z")
    );

    const mapLocation =
      (regexMapLocationMatch &&
        new MapLocation(
          regexMapLocationMatch[1],
          regexMapLocationMatch[2],
          regexMapLocationMatch[3]
        )) ||
      new MapLocation();
    if (!regexMapLocationMatch) {
      mapLocation.zoom = this.props.config.ZOOM;
    }

    return { photoId, mapLocation };
  }

  async componentDidMount() {
    let { photoId, mapLocation } = this.extractPathnameParams();
    this.setState({ photoId, mapLocation });

    this.unregisterAuthObserver = authFirebase.onAuthStateChanged((user) => {
      // will do this after the user has been loaded. It should speed up the users login.
      // not sure if we need this if.
      if (!this.initDone) {
        this.initDone = true;
        this.someInits(photoId);
      }

      if (user && !this.userInitDone) {
        this.userInitDone = true;
        this.someUserInits(user.id);
      }

      // lets start fresh if the user logged out
      if (this.state.user && !user) {
        gtagEvent("Signed out", "User");

        this.props.history.push(this.props.config.PAGES.map.path);
        window.location.reload();
      }
      this.setState({ user });
    });

    this.unregisterConfigObserver = dbFirebase.configObserver(
      (config) => this.setState(config),
      console.error
    );
  }

  // Saving means also to update the state which means also tro re display the maop which is very slow.
  // Wait 100 miliseconds before saving. That allows to enque few changes before actually saving it.
  delayedSaveGeojson = () => {
    if (this.settingGeojson) {
      clearTimeout(this.settingGeojson);
      delete this.settingGeojson;
    }

    this.settingGeojson = setTimeout(() => {
      let geojson = _.cloneDeep(this.state.geojson);

      if (!geojson) {
        geojson = {
          type: "FeatureCollection",
          features: []
        };
      }

      geojson.features = _.map(this.featuresDict, (f) => f);

      // save only if different
      if (!_.isEqual(this.state.geojson, geojson)) {
        this.setState({ geojson });
        // after the first time, wait for a bit before updating.
        localforage.setItem("cachedGeoJson", geojson);
      }
    }, 100);
  };

  photoToFeature = (photo) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [photo.location.longitude, photo.location.latitude]
    },
    properties: photo
  });

  modifyFeature = (photo) => {
    this.featuresDict[photo.id] = this.photoToFeature(photo);
    this.delayedSaveGeojson();
  };

  addFeature = (photo) => this.modifyFeature(photo);

  removeFeature = (photo) => {
    delete this.featuresDict[photo.id];
    this.delayedSaveGeojson();
  };

  someUserInits(userId) {
    dbFirebase.ownPhotosRT(
      userId,
      this.addFeature,
      this.modifyFeature,
      this.removeFeature,
      (error) => {
        console.log(error);
        alert(error);
        window.location.reload();
      }
    );
  }

  someInits(photoId) {
    this.unregisterConnectionObserver = dbFirebase.onConnectionStateChanged(
      (online) => {
        this.setState({ online });
      }
    );

    this.fetchPhotoIfUndefined(photoId).then(async () => {
      // If the selectedFeature is not null, it means that we were able to retrieve a photo from the URL and so we landed
      // into the photoId.
      this.setState({ photoAccessedByUrl: !!this.state.selectedFeature });

      dbFirebase.fetchStats().then((stats) => {
        this.setState({
          stats
        });
      });

      gtagPageView(this.props.location.pathname);
      dbFirebase.photosRT(
        this.addFeature,
        this.modifyFeature,
        this.removeFeature,
        (error) => {
          console.log(error);
          alert(error);
          window.location.reload();
        }
      );
    });

    // use the locals one if we have them: faster boot.
    localforage
      .getItem("cachedGeoJson")
      .then((geojson) => {
        if (geojson) {
          this.geojson = geojson;
          this.setState({ geojson });
          this.featuresDict = geojson.features;
        } else {
          this.fetchPhotos();
        }
      })
      .catch(console.error);
  }

  fetchPhotos() {
    dbFirebase.fetchPhotos().then((photos) => {
      _.forEach(photos, (photo) => {
        this.addFeature(photo);
      });
    });
  }

  async componentWillUnmount() {
    // Terrible hack !!! it will be fixed with redux
    this.setState = console.log;
    await this.unregisterAuthObserver();
    await this.unregisterConnectionObserver();
    await this.unregisterConfigObserver();
    await dbFirebase.disconnect();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.location !== this.props.location) {
      gtagPageView(this.props.location.pathname);

      // if it updates, then it is guaranteed that we didn't landed into the photo
      this.setState({ photoAccessedByUrl: false });
      this.fetchPhotoIfUndefined(
        _.get(this.state, "selectedFeature.properties.id")
      );
    }
  }

  handleClickLoginLogout = () => {
    if (this.state.user) {
      authFirebase.signOut();
    } else {
      this.props.history.push(linkToLogin());
    }
  };

  handleCameraClick = () => {
    if (this.props.config.SECURITY.UPLOAD_REQUIRES_LOGIN && !this.state.user) {
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

  handleMapLocationChange = (newMapLocation) => {
    if (!getMapIsVisible(this.props.history.location.pathname)) {
      return;
    }

    const currentMapLocation = this.extractPathnameParams().mapLocation;

    // change url coords if the coords are different and if we are in the map
    if (
      currentMapLocation == null ||
      !currentMapLocation.isEqual(newMapLocation)
    ) {
      const currentUrl = this.props.history.location;
      const prefix = currentUrl.pathname.split("@")[0];
      const newUrl = `${prefix}@${newMapLocation.urlFormated()}`;

      this.props.history.replace(newUrl);
      this.setState({ mapLocation: newMapLocation });
    }
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

  handlePhotoPageClose = () => {
    const PAGES = this.props.config.PAGES;
    const photoPath = this.props.location.pathname;
    const coords = photoPath.split("@")[1];
    const mapPath = this.props.location.pathname.startsWith(
      PAGES.embeddable.path
    )
      ? PAGES.embeddable.path
      : PAGES.map.path;
    if (this.state.photoAccessedByUrl) {
      const mapUrl = mapPath + (coords ? `@${coords}` : "");
      this.props.history.replace(mapUrl);
      this.props.history.push(photoPath);
    }

    this.props.history.goBack();
  };

  handlePhotoClick = (feature) => {
    this.setState({ selectedFeature: feature });

    let pathname = `${this.props.config.PAGES.displayPhoto.path}/${feature.properties.id}`;
    const currentPath = this.props.history.location.pathname;

    const coordsUrl =
      currentPath.split("@")[1] ||
      new MapLocation(
        feature.geometry.coordinates[1],
        feature.geometry.coordinates[0],
        this.props.config.ZOOM_FLYTO
      ).urlFormated();
    pathname =
      currentPath === this.props.config.PAGES.embeddable.path
        ? currentPath + pathname
        : pathname;

    // if it is in map, change the url
    if (getMapIsVisible(this.props.history.location.pathname)) {
      this.props.history.replace(`${currentPath.split("@")[0]}@${coordsUrl}`);
    }

    this.props.history.push(`${pathname}@${coordsUrl}`);
  };

  reloadPhotos = () => {
    // delete photos.
    this.featuresDict = {};

    // it will open the "loading photos" message
    this.setState({ geojson: null });
    this.fetchPhotos();
  };

  render() {
    const { config } = this.props;
    return (
      <div className="geovation-app">
        <TermsDialog />
        <EmailVerifiedDialog
          user={this.state.user}
          open={
            !!(
              this.state.user &&
              !authFirebase.shouldConsiderEmailVerified(this.state.user)
            )
          }
          handleNextClick={this.handleNextClick}
        />

        <main className="content">
          <WelcomePage />
          <Map
            history={this.props.history}
            visible={getMapIsVisible(this.props.history.location.pathname)}
            geojson={this.state.geojson}
            user={this.state.user}
            config={config}
            embeddable={this.props.history.location.pathname.match(
              new RegExp(config.PAGES.embeddable.path, "g")
            )}
            handleCameraClick={this.handleCameraClick}
            toggleLeftDrawer={this.toggleLeftDrawer}
            handlePhotoClick={this.handlePhotoClick}
            mapLocation={this.state.mapLocation}
            handleMapLocationChange={(newMapLocation) =>
              this.handleMapLocationChange(newMapLocation)
            }
            handleLocationClick={this.handleLocationClick}
            gpsOffline={!this.props.gpsLocation.online}
            gpsDisabled={!this.props.gpsLocation.updated}
          />
          <Routes
            user={this.state.user}
            stats={this.state.stats || EMPTY_STATS}
            gpsLocation={this.props.gpsLocation}
            online={this.state.online}
            geojson={this.state.geojson}
            reloadPhotos={this.reloadPhotos}
            handlePhotoClick={this.handlePhotoClick}
            selectedFeature={this.state.selectedFeature}
            handlePhotoPageClose={this.handlePhotoPageClose}
            sponsorImage={this.state.sponsorImage}
          />
        </main>

        <Snackbar open={!this.state.geojson} message="Loading photos..." />

        <DrawerContainer
          user={this.state.user}
          online={this.state.online}
          handleClickLoginLogout={this.handleClickLoginLogout}
          leftDrawerOpen={this.state.leftDrawerOpen}
          toggleLeftDrawer={this.toggleLeftDrawer}
          stats={this.state.stats || EMPTY_STATS}
          sponsorImage={this.state.sponsorImage}
        />
      </div>
    );
  }
}

export default withRouter(withStyles(styles, { withTheme: true })(App));
