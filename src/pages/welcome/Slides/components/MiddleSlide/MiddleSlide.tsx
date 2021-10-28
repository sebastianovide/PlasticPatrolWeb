import React from "react";
import { makeStyles } from "@material-ui/core";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  return (
    <SlideLayout title={t("welcome_middle_slide_title")}>
      <>
        <p>{t("welcome_middle_slide_content")}</p>
        <img src={globe} className={styles.image} alt="globe" />
      </>
    </SlideLayout>
  );
}
