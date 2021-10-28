import React from "react";
import { useHistory } from "react-router-dom";

import LocationOn from "@material-ui/icons/LocationOn";
import CameraAlt from "@material-ui/icons/CameraAlt";
import CloudUpload from "@material-ui/icons/CloudUpload";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core";
import { Trans } from "react-i18next";

import exampleImage from "assets/images/example.jpeg";

import useLocationOnMount from "hooks/useLocationOnMount";

import { linkToMap } from "custom/config";
import styles from "standard.module.scss";

export type TutorialStep = {
  img?: string;
  text: React.ReactElement;
  title?: React.ReactElement;
  Icon?: React.FC<{ className: string }>;
  Button?: React.FC<{ className?: string }>;
};

const useStyles = makeStyles(() => ({
  button: {
    background: styles.orange,
    color: "white",
    "font-weight": "800",
    fontSize: "18px",
    borderRadius: "10px",
    "&:hover": {
      background: styles.orange
    }
  }
}));

export const tutorialSteps: Array<TutorialStep> = [
  {
    Icon: ({ className }) => <CameraAlt className={className} />,
    title: (
      <Trans i18nKey="tutorial_step_1_title">Photograph litter you find</Trans>
    ),
    img: exampleImage,
    text: (
      <Trans i18nKey="tutorial_step_1_content">
        Get outside, find a piece of litter and take a photo by clicking on the
        camera icon. If there are multiple pieces of litter in the photo please
        make sure each item is clear like in the example image below.
      </Trans>
    )
  },
  {
    Icon: ({ className }) => <CloudUpload className={className} />,
    title: (
      <Trans i18nKey="tutorial_step_2_title">
        Add data about the pieces of litter in your photo
      </Trans>
    ),
    text: (
      <Trans i18nKey="tutorial_step_2_content">
        Add the photo to the app and tag the brand name and type for each piece
        of litter. Your location will be automatically registered.
      </Trans>
    )
  },
  {
    Icon: ({ className }) => <LocationOn className={className} />,
    title: (
      <Trans i18nKey="tutorial_step_3_title">
        View your images on the interactive map and inspire others
      </Trans>
    ),
    text: (
      <Trans i18nKey="tutorial_step_3_content">
        Your photos and data will be approved by our team and will appear in our
        global litter map within 48 hours. Discard of the litter you’ve
        collected properly and invite others to join the app so you join forces
        (or compete!) with litter picking.
      </Trans>
    )
  },
  {
    text: (
      <Trans i18nKey="tutorial_step_4_content">
        By litter picking and recording your findings you are helping build the
        largest and most powerful dataset on litter. We analyse everything you
        collect to drive impactful and evidence-based changes by government and
        brands to protect the environment.
      </Trans>
    ),
    Button: () => {
      const history = useHistory();
      const styles = useStyles();

      const location = useLocationOnMount<{ redirectOnGetStarted?: string }>();

      const locationState = location.state;
      const redirectOnGetStarted =
        locationState && locationState.redirectOnGetStarted;

      return (
        <Button
          className={styles.button}
          onClick={() =>
            history.push(
              redirectOnGetStarted ? redirectOnGetStarted : linkToMap()
            )
          }
        >
          <Trans i18nKey="get_started_button_text">Get started</Trans>
        </Button>
      );
    }
  }
];
