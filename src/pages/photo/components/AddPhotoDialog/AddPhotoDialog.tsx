// Custom Dialog to choose camera and photo library to interact with cordova-plugin-camera

import React, { useRef, useEffect } from "react";

import RootRef from "@material-ui/core/RootRef";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import IconButton from "@material-ui/core/IconButton";
import ListItemText from "@material-ui/core/ListItemText";
import Dialog from "@material-ui/core/Dialog";
import CameraIcon from "@material-ui/icons/PhotoCamera";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import CancelIcon from "@material-ui/icons/Close";
import { useLocation } from "react-router-dom";

type Props = {
  onClose: () => void;
  handlePhotoSelect: (value: string | File) => void;
  inputRef: HTMLInputElement | null;
  isCordova: boolean;
};

export default function AddPhotoDialogWithHiddenInputForDesktop(props: Props) {
  const { isCordova, inputRef } = props;
  useEffect(() => {
    if (!isCordova && inputRef) {
      inputRef.click();
    }
  }, [isCordova, inputRef]);

  return isCordova ? <AddPhotoDialog {...props} /> : <div />;
}

function AddPhotoDialog({ onClose, handlePhotoSelect }: Props) {
  return (
    <Dialog onClose={onClose} open>
      <List>
        <ListItem
          button
          onClick={() =>
            handlePhotoDialogItemClick("CAMERA", handlePhotoSelect)
          }
        >
          <IconButton color="primary" edge={false}>
            <CameraIcon />
          </IconButton>
          <ListItemText primary={"Camera"} />
        </ListItem>
        <ListItem
          button
          onClick={() =>
            handlePhotoDialogItemClick("PHOTOLIBRARY", handlePhotoSelect)
          }
        >
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

function handlePhotoDialogItemClick(
  value: string,
  callback: (metaData: any, fileName: string) => void
) {
  // @ts-ignore
  const Camera = navigator.camera;
  const srcType =
    value === "CAMERA"
      ? Camera.PictureSourceType.CAMERA
      : Camera.PictureSourceType.PHOTOLIBRARY;

  // this.setState({
  //   srcType: value === "CAMERA" ? "camera" : "filesystem"
  // });
  Camera.getPicture(
    //https://cordova.apache.org/docs/en/1.6.0/cordova/camera/camera.getPicture.html
    (imageUri: string) => {
      const file = JSON.parse(imageUri);
      const cordovaMetadata = JSON.parse(file.json_metadata);
      callback(cordovaMetadata, file);
    },
    (message: string) => {
      console.log("Failed because: ", message);
    },
    {
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: srcType,
      correctOrientation: true
    }
  );
}
