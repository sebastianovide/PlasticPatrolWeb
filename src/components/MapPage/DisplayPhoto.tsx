import React, { useState } from "react";

import _ from "lodash";

import BackIcon from "@material-ui/icons/ArrowBack";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

import { isIphoneWithNotchAndCordova, isIphoneAndCordova } from "utils";
import { tweetMessage } from "static/info";

import CardComponent from "../CardComponent";
import Feature from "types/Feature";
import User from "types/User";
import { dbFirebase } from "features/firebase";
import ConfirmationDialog, {
  Confirmation
} from "components/common/ConfirmationDialog";

const tweetLogo = process.env.PUBLIC_URL + "/images/twitter.svg";
const placeholderImage = process.env.PUBLIC_URL + "/custom/images/logo.svg";

const useStyles = makeStyles((theme) => ({
  notchTop: {
    paddingTop: isIphoneWithNotchAndCordova()
      ? "env(safe-area-inset-top)"
      : isIphoneAndCordova
      ? theme.spacing(1.5)
      : undefined
  },
  iconButton: {
    marginRight: theme.spacing(2)
  },
  main: {
    marginTop: theme.spacing(2)
  },
  tweetLogo: {
    padding: theme.spacing(1.6)
  },
  notchBottom: {
    paddingBottom: isIphoneWithNotchAndCordova()
      ? "env(safe-area-inset-bottom)"
      : 0
  }
}));

interface Props {
  user: User;
  config: any;
  feature?: Feature;
  handleClose: () => void;
  location: any;
}

export default function DisplayPhoto({
  user,
  config,
  feature,
  handleClose,
  location
}: Props) {
  const formatField = (value: string, fieldName: string): string => {
    const formater = config.PHOTO_ZOOMED_FIELDS[fieldName];
    if (value) {
      return formater(value);
    }

    return "-";
  };

  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [confirmation, setConfirmation] = useState<Confirmation | undefined>();
  const photoID = _.get(feature, "properties.id", "");
  const coords = location.pathname.split("@")[1];
  const photoUrl = `${config.metadata.metadataServerUrl}/${photoID}@${coords}`;
  const photoTweetLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    tweetMessage
  )}&url=${encodeURIComponent(photoUrl)}`;

  return (
    <div>
      {typeof feature === "undefined" ? (
        <Dialog
          open
          PaperProps={{
            style: { backgroundColor: "transparent", boxShadow: "none" }
          }}
        >
          <CircularProgress color="primary" />
        </Dialog>
      ) : (
        <Dialog
          fullScreen={fullScreen}
          open
          aria-labelledby="responsive-dialog-title"
        >
          <AppBar position="static" className={classes.notchTop}>
            <Toolbar>
              <BackIcon className={classes.iconButton} onClick={handleClose} />
              <Typography variant="h6" color="inherit">
                {config.PAGES.displayPhoto.label}
              </Typography>
            </Toolbar>
          </AppBar>

          <DialogContent>
            <div style={{ textAlign: "center" }}>
              <img
                onError={(e) => {
                  // @ts-ignore
                  e.target.src = placeholderImage;
                }}
                className={"main-image"}
                alt={""}
                src={(feature && feature.properties.main) || placeholderImage}
              />
            </div>
            {feature === null ? (
              <h3>Error!!! No item found at the given url</h3>
            ) : (
              <Card>
                <div style={{ display: "flex" }}>
                  <CardActionArea>
                    <CardContent>
                      {Object.keys(config.PHOTO_ZOOMED_FIELDS).map(
                        (fieldName) => (
                          <Typography gutterBottom key={fieldName}>
                            <b>{_.capitalize(fieldName)}: </b>
                            {formatField(
                              // @ts-ignore
                              feature.properties[fieldName],
                              fieldName
                            )}
                          </Typography>
                        )
                      )}
                    </CardContent>
                  </CardActionArea>
                  <a
                    className={classes.tweetLogo}
                    href={photoTweetLink}
                    target="blank"
                  >
                    <img src={tweetLogo} alt="tweet" />
                  </a>
                </div>
                {user && user.isModerator && (
                  <div>
                    <Divider />
                    <div>
                      <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography>Moderator Details</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                          <CardComponent
                            photoSelected={feature.properties}
                            handleReject={() => {
                              setConfirmation({
                                message: `Are you sure you want to unpublish the photo ?`,
                                onConfirmation: () =>
                                  dbFirebase.writeModeration(
                                    feature.properties.id,
                                    user.id,
                                    false
                                  )
                              });
                            }}
                            handleApprove={() => {
                              setConfirmation({
                                message: `Are you sure you want to publish the photo ?`,
                                onConfirmation: () =>
                                  dbFirebase.writeModeration(
                                    feature.properties.id,
                                    user.id,
                                    true
                                  )
                              });
                            }}
                          />
                        </ExpansionPanelDetails>
                      </ExpansionPanel>
                    </div>
                  </div>
                )}
                <ConfirmationDialog
                  confirmation={confirmation}
                  setConfirmation={setConfirmation}
                />
              </Card>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
