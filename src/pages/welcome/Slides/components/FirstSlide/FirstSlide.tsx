import React from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  return (
    <SlideLayout title={t("welcome_first_slide_title")}>
      <>
        <img src={seeIt} alt={t("welcome_first_slide_see_it_img_alt")} className={styles.image} />
        <p className={styles.text}>{t("welcome_first_slide_see_it_content")}</p>

        <img src={snapIt} alt={t("welcome_first_slide_snap_it_img_alt")} className={styles.image} />
        <p className={styles.text}>{t("welcome_first_slide_snap_it_content")}</p>

        <img src={mapIt} alt={t("welcome_first_slide_map_it_img_alt")} className={styles.image} />
        <p className={styles.text}>{t("welcome_first_slide_map_it_content")}</p>
      </>
    </SlideLayout>
  );
}
