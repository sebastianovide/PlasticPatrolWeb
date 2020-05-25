// Custom Dialog to choose camera and photo library to interact with cordova-plugin-camera

import React from "react";
import PropTypes from "prop-types";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import IconButton from "@material-ui/core/IconButton";
import ListItemText from "@material-ui/core/ListItemText";
import Dialog from "@material-ui/core/Dialog";
import CameraIcon from "@material-ui/icons/PhotoCamera";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import CancelIcon from "@material-ui/icons/Close";

type Props = {
  onClose: () => void;
  handleListItemClick: (value: string) => void;
};

export default function AddPhotoDialog({
  onClose,
  handleListItemClick
}: Props) {
  return (
    <Dialog onClose={onClose} open>
      <List>
        <ListItem button onClick={() => handleListItemClick("CAMERA")}>
          <IconButton color="primary" edge={false}>
            <CameraIcon />
          </IconButton>
          <ListItemText primary={"Camera"} />
        </ListItem>
        <ListItem button onClick={() => handleListItemClick("PHOTOLIBRARY")}>
          <IconButton color="primary" edge={false}>
            <PhotoLibraryIcon />
          </IconButton>
          <ListItemText primary={"Photo Library"} />
        </ListItem>
        <ListItem button onClick={onClose}>
          <IconButton edge={false}>
            <CancelIcon />
          </IconButton>
          <ListItemText primary="Cancel" />
        </ListItem>
      </List>
    </Dialog>
  );
}
