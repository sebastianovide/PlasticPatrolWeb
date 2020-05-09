import React from "react";
import _ from "lodash";

import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import GroupIcon from "@material-ui/icons/Group";
import SchoolIcon from "@material-ui/icons/School";
import DashboardIcon from "@material-ui/icons/Dashboard";
import HelpIcon from "@material-ui/icons/Help";
import EventIcon from "@material-ui/icons/Event";
import FeedbackIcon from "@material-ui/icons/Feedback";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";

import styles from "standard.scss";

import enums from "types/enums";
import User from "types/User";
import Page from "types/Page";
import Stats from "types/Stats";

import TitleTextField from "components/pages/PhotoPage/AdminApproval/TitleTextField";
import MultiFields from "components/pages/PhotoPage/AdminApproval/MultiFields";

import data from "./categories.json";

const primaryMain = styles.primaryMain;
const primaryContrastText = styles.primaryContrastText;
const secondaryMain = styles.secondaryMain;
const secondaryContrastText = styles.primaryContrastText;

const PAGES: { [pageName: string]: Page } = {
  map: {
    path: "/",
    label: "Map"
  },
  embeddable: {
    path: "/embeddable",
    label: "Map"
  },
  photos: {
    path: "/photo",
    label: "Photo"
  },
  moderator: {
    path: "/moderator",
    label: "Photo Approval",
    icon: <CheckCircleIcon />,
    visible: (user: User | undefined, online: boolean) =>
      !!(user && user.isModerator)
  },
  account: {
    path: "/account",
    label: "Account",
    icon: <AccountCircleIcon />,
    visible: (user: User | undefined, online: boolean) => !!user
  },
  about: {
    path: "/about",
    label: "About",
    visible: (user: User | undefined, online: boolean) => true,
    icon: <HelpIcon />
  },
  tutorial: {
    path: "/tutorial",
    label: "Tutorial",
    visible: (user: User | undefined, online: boolean) => true,
    icon: <SchoolIcon />
  },
  writeFeedback: {
    path: "/write-feedback",
    label: "Feedback",
    visible: (user: User | undefined, online: boolean) => true,
    icon: <FeedbackIcon />
  },
  events: {
    path: "/events",
    label: "Clean-ups"
  },
  partners: {
    path: "/partners",
    label: "Partners"
  },
  leaderboard: {
    path: "/leaderboard",
    label: "Leaderboard",
    visible: (user: User | undefined, online: boolean) => true,
    icon: <DashboardIcon />
  },
  feedbackReports: {
    path: "/feedback-reports",
    label: "Feedback Reports",
    icon: <LibraryBooksIcon />,
    visible: (user: User | undefined, online: boolean) =>
      !!(user && user.isModerator)
  },
  feedbackDetails: {
    path: "/feedback-details",
    label: "Feedback Details"
  },
  displayPhoto: {
    path: "/photos",
    label: "photos"
  },
  cleanUps: {
    path: "https://plasticpatrol.co.uk/clean-ups/",
    visible: (user: User | undefined, online: boolean) => true,
    icon: <EventIcon />,
    label: "Clean-ups"
  },
  groups: {
    path: "/groups",
    label: "Groups",
    visible: (user, online) => true,
    icon: <GroupIcon />
  },
  grouplist: {
    path: "/grouplist",
    label: "List Groups",
    visible: (user, online) => true
  },
  groupadd: {
    path: "/groupadd",
    label: "Create a Group",
    visible: (user, online) => true
  }
};

export default {
  metadata: {
    metadataServerUrl: "https://md.plasticpatrol.co.uk",
    serverUrl: "https://app.plasticpatrol.co.uk",
    twSite: "@Plastic_Patrol",
    twCreator: "@LizzieOutside",
    twDomain: "www.plasticpatrol.co.uk",
    _twDescriptionField: "pieces",
    twDescription:
      "The global movement that is crowdsource cleaning the planet. Download the Plastic Patrol app to join the movement!",
    twTitle: "Plastic Patrol"
  },
  MAX_IMAGE_SIZE: 2048,
  THEME: {
    palette: {
      primary: { main: primaryMain, contrastText: primaryContrastText },
      secondary: { main: secondaryMain, contrastText: secondaryContrastText }
    },
    spacing: 10
  },
  MAP_SOURCE: "mapbox://styles/mapbox/streets-v10",
  // MAP_SOURCE: "https://s3-eu-west-1.amazonaws.com/tiles.os.uk/styles/open-zoomstack-outdoor/style.json",
  // MAP_ATTRIBUTION: "Contains OS data &copy; Crown copyright and database rights 2018",
  MAPBOX_TOKEN:
    "pk.eyJ1IjoibmVpbGZ1bHdpbGVyIiwiYSI6ImNrOGN1dWV2bzBxaHIzZnRxaDhtOWJ0ODYifQ.D56TN1nXxU0vGfmYb21T2w",
  GA_TRACKING_ID: "UA-126516084-1",
  GA_PROPERTY_ID: "189010506",
  PHOTO_ZOOMED_FIELDS: {
    updated: (s: string) => new Date(s).toDateString(),
    pieces: (s: string) => s
  },
  ZOOM: 5,
  ZOOM_FLYTO: 15,
  CENTER: [-2, 55],
  PHOTO_FIELDS: {
    pieces: {
      name: "pieces",
      title: "Number of pieces collected",
      type: enums.TYPES.number,
      placeholder: "eg. 123",
      inputProps: { min: 0, step: 1 },
      regexValidation: "^[0-9]+",
      component: TitleTextField
    },
    categories: {
      component: MultiFields.MultiFieldsWithStyles,
      nakedComponent: MultiFields.MultiFieldsOriginal,
      name: "categories",

      placeholder: "Add litter category",
      data: data,
      noOptionsMessage: "No more categories",
      sanitize: (value: any) => {
        _.forEach(value, (category: any) => {
          category.brand =
            category.brand.replace &&
            category.brand.replace(/\s+/g, " ").trim();
        });
        return value;
      },

      subfields: {
        number: {
          component: TitleTextField,
          inputProps: { min: 0, step: 1 },
          name: "number",
          title: "Number",
          type: enums.TYPES.number,
          placeholder: "eg. 123",
          regexValidation: "^[0-9]+"
        },
        brand: {
          component: TitleTextField,
          name: "brand",
          title: "Brand",
          type: enums.TYPES.string,
          placeholder: "eg. whatever",
          regexValidation: ".+"
        }
      }
    }
  },
  PAGES,
  getStats: (photos: any, dbStats: Stats) => (dbStats && dbStats.pieces) || 0,
  ENABLE_GRAVATAR_PROFILES: true, //To update user-profile from Gravatar, value: true or false.
  SECURITY: {
    UPLOAD_REQUIRES_LOGIN: true
  },
  MODERATING_PHOTOS: 15,
  LEADERBOARD_FIELD: {
    label: "Pieces",
    field: "pieces"
  }
};
