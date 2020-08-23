import React, {createRef, useState} from "react";
import { Route, useHistory } from "react-router-dom";

import { linkToTutorialPage } from "routes/tutorial/links";
import { CordovaCameraImage } from "types/Photo";
import AddPhotoDialog from "pages/photo/components/AddPhotoDialog";
import { NewPhotoPage } from "pages/photo";

import { linkToCategoriseWithState } from "../categorise/links";
import { linkToAddDialog, linkToNewPhoto } from "./links";
import { DesktopPhotoFallback } from "../../../../components/common/DesktopPhotoFallback";

const linkToTutorialWithRedirect = () => ({
  pathname: linkToTutorialPage(),
  state: {
    redirectOnGetStarted: linkToNewPhoto()
  }
});

export default function NewPhotoRoute() {
  const history = useHistory();
  const handlePhotoSelect = (
    file: File | CordovaCameraImage,
    fromCamera: boolean
  ) => history.push(linkToCategoriseWithState(file, fromCamera));

  const desktopPhotoRef = createRef<HTMLInputElement>();

  // @ts-ignore
  const isCordova = !!window.cordova;

  return (
    <>
      <NewPhotoPage
        onPhotoClick={() => {
          isCordova
            ? history.push(linkToAddDialog())
            : desktopPhotoRef.current && desktopPhotoRef.current.click();
        }}
        linkToTutorialPage={linkToTutorialWithRedirect}
      />
      <DesktopPhotoFallback ref={desktopPhotoRef}
                            handlePhotoSelect={handlePhotoSelect}/>
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
