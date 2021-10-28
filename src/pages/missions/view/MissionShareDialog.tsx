import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  makeStyles
} from "@material-ui/core";

import CloseIcon from "@material-ui/icons/Close";
import LinkIcon from "@material-ui/icons/Link";
import Snackbar from "@material-ui/core/Snackbar";
import { Plugins } from "@capacitor/core";
import { Twitter, WhatsApp } from "features/sharing";
import config from "custom/config";

const { Clipboard } = Plugins;
const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(0.5),
    top: theme.spacing(0.5),
    color: theme.palette.grey[500],
    zIndex: 1
  },
  linkButton: {
    margin: -theme.spacing(1)
  }
}));

export default function MissionShareModal({
  open,
  onClose,
  missionId,
  isPrivate
}: {
  open: boolean;
  onClose: () => void;
  missionId: string;
  isPrivate: boolean;
}) {
  const styles = useStyles();
  const { t } = useTranslation();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const shareMessage = t("mission_share_dialog_content_2");
  const url =
    process.env.NODE_ENV !== "development"
      ? `${config.metadata.serverUrl}/#/missions/${missionId}?utm_source=app_share`
      : `https://${window.location.host}/#/missions/${missionId}?utm_source=app_share`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <IconButton
        aria-label="close"
        className={styles.closeButton}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <DialogTitle id="alert-dialog-description">
          {t("mission_share_dialog_title")}
        </DialogTitle>
        <DialogContentText>
          {!isPrivate
            ? t("mission_share_dialog_content_1")
            : t("This Mission is private, by sharing it other users will be able to discover it.")}
        </DialogContentText>
        <DialogContentText>
          <Grid spacing={2} container justify="center">
            <Grid item>
              <IconButton
                aria-label="link"
                className={styles.linkButton}
                onClick={() => {
                  Clipboard.write({
                    string: url
                  });
                  setOpenSnackbar(true);
                }}
              >
                <LinkIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <Twitter message={shareMessage} url={url} />
            </Grid>
            <Grid item>
              <WhatsApp message={shareMessage} url={url} />
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={openSnackbar}
        autoHideDuration={3000}
        message={t("mission_share_dialog_snackbar_message")}
        onClose={() => setOpenSnackbar(false)}
      />
    </Dialog>
  );
}
