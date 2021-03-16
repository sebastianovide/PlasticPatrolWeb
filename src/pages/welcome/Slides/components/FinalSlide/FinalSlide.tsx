import React from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core";

import handPrint from "assets/images/intro/handPrint.png";

import styles from "standard.module.scss";

import SlideLayout from "../SlideLayout";

const useStyles = makeStyles(() => ({
  image: {
    maxHeight: "30vh"
  },
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

export default function FinalSlide({ onButtonClick }: any) {
  const styles = useStyles();
  return (
    <SlideLayout title="Ready to make your mark?">
      <>
        <img src={handPrint} className={styles.image} alt="" />
        <Button className={styles.button} onClick={onButtonClick}>
          Get started
        </Button>
      </>
    </SlideLayout>
  );
}
