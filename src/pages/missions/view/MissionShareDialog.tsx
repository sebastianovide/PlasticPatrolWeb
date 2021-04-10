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

import { Twitter, WhatsApp } from "features/sharing";

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(0.5),
    top: theme.spacing(0.5),
    color: theme.palette.grey[500]
  }
}));

export default function MissionShareModal({
  open,
  onClose,
  isPrivate
}: {
  open: boolean;
  onClose: () => void;
  missionId: string;
  isPrivate: boolean;
}) {
  const styles = useStyles();

  const shareMessage = singleMissionShareMessage;

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
          Share this mission with your friends
        </DialogTitle>
        <DialogContentText>DM friends to join the mission!</DialogContentText>
        {isPrivate && (
          <DialogContentText>
            This mission is private, by sharing it other users will be able to
            discover it. They will be able to see information about the mission
            such as its name, target and how long it is going on for, but you
            will have to manually approve new members before they can see who
            else is part of this mission
          </DialogContentText>
        )}
        <DialogContentText>
          <Grid spacing={2} container justify="center">
            <Grid item>
              <Twitter message={shareMessage} />
            </Grid>
            <Grid item>
              <WhatsApp message={shareMessage} />
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}

const singleMissionShareMessage =
  "Planet Patrol has a new feature, Missions!\nDownload the Planet Patrol app, click on Missions in the menu bar, join the mission and then document any litter you see.";
