// Custom Dialog to choose camera and photo library to interact with cordova-plugin-camera

import React from "react";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import IconButton from "@material-ui/core/IconButton";
import ListItemText from "@material-ui/core/ListItemText";
import Dialog from "@material-ui/core/Dialog";
import CameraIcon from "@material-ui/icons/PhotoCamera";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import CancelIcon from "@material-ui/icons/Close";

// import { Plugins, CameraResultType, CameraPhoto } from '@capacitor/core';
// import { CameraSource } from "@capacitor/camera";

import { CordovaCameraImage } from "../../state/types";

type Props = {
  onClose: () => void;
  handlePhotoSelect: (image: CordovaCameraImage, fromCamera: boolean) => void;
};

// It is broken: https://github.com/ionic-team/capacitor-plugins/issues/45
// const { Camera } = Plugins;

export default function AddPhotoDialog({ onClose, handlePhotoSelect }: Props) {
  return (
    <Dialog onClose={onClose} open>
      <List>
        <ListItem
          button
          onClick={() => {
            handlePhotoDialogItemClick("CAMERA", (file) =>
              handlePhotoSelect(file, true)
            );
          }}
        >
          <IconButton color="primary" edge={false}>
            <CameraIcon />
          </IconButton>
          <ListItemText primary={"Camera"} />
        </ListItem>
        <ListItem
          button
          onClick={() =>
            handlePhotoDialogItemClick("PHOTOLIBRARY", (file) =>
              handlePhotoSelect(file, false)
            )
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
  callback: (file: CordovaCameraImage) => void
) {
  // if (!Camera?.getPhoto) return handlePhotoDialogItemClickCordova(value, callback);
  // else return handlePhotoDialogItemClickCapacitor(value, callback);
  return handlePhotoDialogItemClickCordova(value, callback);
}

function handlePhotoDialogItemClickCordova(
  value: string,
  callback: (file: CordovaCameraImage) => void
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
      callback(file as CordovaCameraImage);
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

// async function handlePhotoDialogItemClickCapacitor(
//   value: string,
//   callback: (file: CordovaCameraImage) => void
// ) {
//   const source: CameraSource =
//     value === "CAMERA"
//       ? CameraSource.Camera
//       : CameraSource.Photos;
    
//   try {
//     const foto: CameraPhoto = await Camera.getPhoto({
//       quality: 50,
//       resultType: CameraResultType.Uri,
//       source
//     });

//     debugger
//     callback({ filename: foto.dataUrl, json_metadata: foto.exif });
//   } catch (e) {
//     console.log("Failed because: ", e);
//   }
// }