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

  const shareMessage =
    "Join me in a litter picking Mission, Download the free Planet Patrol app and log any litter you see. See it 👀 Snap it 📸 Map it 🗺️";
  const url =
    process.env.NODE_ENV !== "development"
      ? `${config.metadata.serverUrl}/#/missions/${missionId}`
      : `https://${window.location.host}/#/missions/${missionId}`;

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
              <IconButton
                aria-label="link"
                className={styles.linkButton}
                onClick={() =>
                  Clipboard.write({
                    string: url
                  })
                }
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
    </Dialog>
  );
}
