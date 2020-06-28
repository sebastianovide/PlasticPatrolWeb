import React, { useState } from "react";

import _ from "lodash";

import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";

import Photo from "types/Photo";
import PageWrapper from "./PageWrapper";
import CardComponent from "./CardComponent";
import "./ModeratorPage.scss";
import config from "../custom/config";
import { DialogTitle, DialogActions, Button } from "@material-ui/core";

const placeholderImage = process.env.PUBLIC_URL + "/custom/images/logo.svg";

const useStyles = makeStyles(() => ({
  noPhotos: {
    opacity: ".5",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    height: "100%",
    alignItems: "center"
  }
}));

interface Props {
  label: string;
  photos: Photo[];
  handleClose: () => void;
  handleRejectClick: (photo: Photo) => void;
  handleApproveClick: (photo: Photo) => void;
}

type Confirmation = {
  message: string;
  onConfirmation: () => void;
};

const ModeratorPage = ({
  label,
  photos,
  handleRejectClick,
  handleApproveClick,
  handleClose
}: Props) => {
  const styles = useStyles();
  const [zoomDialogOpen, setZoomDialogOpen] = useState(false);
  const [photoSelected, setPhotoSelected] = useState<Photo | undefined>();
  const [confirmation, setConfirmation] = useState<Confirmation | undefined>();

  const closeZoomDialog = () => setZoomDialogOpen(false);
  const handlePhotoClick = (photoSelected: Photo) => {
    setZoomDialogOpen(true);
    setPhotoSelected(photoSelected);
  };

  if (photos.length === 0) {
    return (
      <PageWrapper label={label} navigationHandler={{ handleClose }}>
        <div className={styles.noPhotos}>No photos to moderate!</div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper label={label} navigationHandler={{ handleClose }}>
      <List dense={false}>
        {_.map(photos, (photo) => (
          <ListItem
            key={photo.id}
            button
            onClick={() => handlePhotoClick(photo)}
          >
            <ListItemAvatar>
              <Avatar
                imgProps={{
                  onError: (e) => {
                    // @ts-ignore
                    e.target.src = placeholderImage;
                  }
                }}
                src={photo.thumbnail}
              />
            </ListItemAvatar>
            <ListItemText
              primary={config.PHOTO_ZOOMED_FIELDS.updated(photo.updated)}
            />
            <ListItemSecondaryAction>
              <IconButton
                aria-label="Reject"
                edge={false}
                onClick={() => {
                  setConfirmation({
                    message: `Are you sure you want to unpublish the photo ?`,
                    onConfirmation: () => handleRejectClick(photo)
                  });
                }}
              >
                <ThumbDownIcon />
              </IconButton>
              <IconButton
                aria-label="Approve"
                edge={false}
                onClick={() => {
                  setConfirmation({
                    message: `Are you sure you want to publish the photo ?`,
                    onConfirmation: () => handleApproveClick(photo)
                  });
                }}
              >
                <ThumbUpIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {confirmation && (
        <Dialog open={true} onClose={() => setConfirmation(undefined)}>
          <DialogTitle>{confirmation.message}</DialogTitle>
          <DialogActions>
            <Button onClick={() => setConfirmation(undefined)} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => {
                setConfirmation(undefined);
                confirmation.onConfirmation();
              }}
              color="primary"
            >
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Dialog open={zoomDialogOpen} onClose={closeZoomDialog}>
        <DialogContent>
          {photoSelected && (
            <div style={{ textAlign: "center" }}>
              <img
                className={"main-image"}
                onError={(e) => {
                  // @ts-ignore
                  e.target.src = placeholderImage;
                }}
                alt={photoSelected.id}
                src={photoSelected.main}
              />
            </div>
          )}
          <CardComponent
            photoSelected={photoSelected}
            handleRejectClick={(photo: Photo) =>
              setConfirmation({
                message: `Are you sure you want to unpublish the photo ?`,
                onConfirmation: () => handleRejectClick(photo)
              })
            }
            handleApproveClick={(photo: Photo) =>
              setConfirmation({
                message: `Are you sure you want to publish the photo ?`,
                onConfirmation: () => handleApproveClick(photo)
              })
            }
          />
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
};

export default ModeratorPage;
