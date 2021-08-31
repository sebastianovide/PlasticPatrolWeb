import React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  makeStyles
} from "@material-ui/core";

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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Download the free Planet Patrol app from the App or Google Play Store,
          then follow the link to join the Mission
        </DialogContentText>
        <Button
          color="primary"
          size="small"
          variant="contained"
          className={classes.button}
          href="https://apps.apple.com/gb/app/plastic-patrol/id1235072883"
        >
          Download on the App Store
        </Button>
        <Button
          color="primary"
          size="small"
          variant="contained"
          className={classes.button}
          href="https://play.google.com/store/apps/details?id=uk.co.plasticpatrol"
        >
          Download from the Play Store
        </Button>
        <Button
          onClick={onClose}
          color="primary"
          size="small"
          variant="outlined"
          className={classes.button}
        >
          Ok
        </Button>
      </DialogContent>
    </Dialog>
  );
}
