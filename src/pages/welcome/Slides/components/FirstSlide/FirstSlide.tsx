import React from "react";

import seeIt from "assets/images/intro/seeIt.png";
import snapIt from "assets/images/intro/snapIt.png";
import mapIt from "assets/images/intro/mapIt.png";

import SlideLayout from "../SlideLayout";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  image: { height: "10vh", width: "auto" },
  text: { marginTop: 0 }
}));

export default function FirstSlide() {
  const styles = useStyles();
  return (
    <SlideLayout title="Welcome to the global movement to clean up the planet">
      <>
        <img src={seeIt} alt="See it" className={styles.image} />
        <p className={styles.text}>Pick up a piece of litter</p>

        <img src={snapIt} alt="Snap it" className={styles.image} />
        <p className={styles.text}>Take a photo and record the brand name</p>

        <img src={mapIt} alt="Map it" className={styles.image} />
        <p className={styles.text}>Upload your findings to our global map</p>
      </>
    </SlideLayout>
  );
}
