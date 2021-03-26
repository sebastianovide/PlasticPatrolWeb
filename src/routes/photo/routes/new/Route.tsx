import React, { createRef, useState } from "react";
import { Route, useHistory } from "react-router-dom";
import { Plugins, CameraResultType, CameraPhoto } from '@capacitor/core';

import { linkToTutorialPage } from "routes/tutorial/links";

import AddPhotoDialog from "pages/photo/components/AddPhotoDialog";
import { usePhotoPageDispatch, setFile, FileType } from "pages/photo/state";
import { NewPhotoPage } from "pages/photo";
import { DesktopPhotoFallback } from "components/common/DesktopPhotoFallback";

import { linkToCategorise } from "../categorise/links";
import { linkToAddDialog, linkToNewPhoto } from "./links";
import { CordovaCameraImage } from "types/Photo";

const { Camera } = Plugins;

const linkToTutorialWithRedirect = () => ({
  pathname: linkToTutorialPage(),
  state: {
    redirectOnGetStarted: linkToNewPhoto()
  }
});

export default function NewPhotoRoute() {
  const history = useHistory();

  const dispatch = usePhotoPageDispatch();
  const handlePhotoSelect = (file: FileType, fromCamera: boolean) => {
    dispatch(setFile(file, fromCamera));
    history.push(linkToCategorise());
  };
  const desktopPhotoRef = createRef<HTMLInputElement>();

  // @ts-ignore
  const isCordova = !!window.cordova;

  const takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64
    });

    const mime = "image/" + image.format;
    const filename = 'dataURI-file-' + (new Date()).getTime() + '.' + image.format;
    const bytes = atob(image.base64String + "")

    const writer = new Uint8Array(new ArrayBuffer(bytes.length));

    for (let i=0; i < bytes.length; i++) {
      writer[i] = bytes.charCodeAt(i);
    }

    return new File([writer.buffer], filename, { type: mime });
  };

  return (
    <>
      <NewPhotoPage
        onPhotoClick={async () => {
          handlePhotoSelect(await takePicture() , false)

          // isCordova
          //   ? history.push(linkToAddDialog())
          //   : desktopPhotoRef.current && desktopPhotoRef.current.click();

        }}
        linkToTutorialPage={linkToTutorialWithRedirect}
      />
      <DesktopPhotoFallback
        ref={desktopPhotoRef}
        handlePhotoSelect={handlePhotoSelect}
      />
      <Route path={linkToAddDialog()} exact>
        <AddPhotoDialog
          onClose={() => history.goBack()}
          handlePhotoSelect={(image, fromCamera) =>
            handlePhotoSelect(image, fromCamera)
          }
        />
      </Route>
    </>
  );
}
