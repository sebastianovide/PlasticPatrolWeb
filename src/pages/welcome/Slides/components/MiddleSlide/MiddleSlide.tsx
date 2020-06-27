import React from "react";
import { makeStyles } from "@material-ui/core";

import globe from "assets/images/intro/globe.png";

import SlideLayout from "../SlideLayout";

const useStyles = makeStyles(() => ({
  image: {
    maxHeight: "35vh",
    marginBottom: "5vh"
  }
}));

export default function MiddleSlide() {
  const styles = useStyles();
  return (
    <SlideLayout title="Creating global change">
      <>
        <p>
          Litter you record helps identify top polluters and influence
          government change
        </p>
        <img src={globe} className={styles.image} alt="globe" />
      </>
    </SlideLayout>
  );
}
