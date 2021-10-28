import React from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  return (
    <SlideLayout title={t("welcome_final_slide_title")}>
      <>
        <img src={handPrint} className={styles.image} alt="" />
        <Button className={styles.button} onClick={onButtonClick}>
          {t("get_started_button_text")}
        </Button>
      </>
    </SlideLayout>
  );
}
