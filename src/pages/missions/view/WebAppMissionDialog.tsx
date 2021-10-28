import React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  makeStyles
} from "@material-ui/core";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  button: {
    width: `100%`,
    margin: `${theme.spacing(1)}px ${theme.spacing(0.5)}px`
  }
}));

export default function WebAppMissionDialog({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t("web_app_mission_dialog_content")}
        </DialogContentText>
        <Button
          color="primary"
          size="small"
          variant="contained"
          className={classes.button}
          href="https://apps.apple.com/gb/app/plastic-patrol/id1235072883"
        >
          {t("web_app_mission_dialog_app_store_button_text")}
        </Button>
        <Button
          color="primary"
          size="small"
          variant="contained"
          className={classes.button}
          href="https://play.google.com/store/apps/details?id=uk.co.plasticpatrol"
        >
          {t("web_app_mission_dialog_play_store_button_text")}
        </Button>
        <Button
          onClick={onClose}
          color="primary"
          size="small"
          variant="outlined"
          className={classes.button}
        >
          {t("ok_button_text")}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
