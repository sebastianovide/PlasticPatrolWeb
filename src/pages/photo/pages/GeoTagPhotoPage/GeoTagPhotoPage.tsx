import React from "react";
import { Typography, makeStyles, Button } from "@material-ui/core";
import GeoTagMap from "pages/photo/components/GeoTagMap";
import { usePhotoPageDispatch, setLocation } from "pages/photo/state";
import { LatLong } from "types/GPSLocation";
import { useHistory } from "react-router-dom";
import { linkToCategorise } from "routes/photo/routes/categorise/links";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    height: "100%",
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  }
}));

export default function GeoTagPhotoPage() {
  const styles = useStyles();
  const dispatch = usePhotoPageDispatch();
  const onLocationUpdate = (location: LatLong) =>
    dispatch(setLocation(location));

  const history = useHistory();
  const { t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <Typography>{t("record_litter_geotag_hint")}</Typography>
      <GeoTagMap onLocationUpdate={onLocationUpdate} />
      <Button
        onClick={() => history.push(linkToCategorise())}
        color="primary"
        variant="contained"
      >
        {t("next_button_text")}
      </Button>
    </div>
  );
}
