import React, { useState } from "react";
import { Route, useHistory } from "react-router-dom";

import { linkToTutorialPage } from "routes/tutorial/links";

import AddPhotoDialog from "pages/photo/components/AddPhotoDialog";
import { usePhotoPageDispatch, setFile, FileType } from "pages/photo/state";
import { NewPhotoPage } from "pages/photo";

import { linkToCategorise } from "../categorise/links";
import { linkToAddDialog, linkToNewPhoto } from "./links";

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
    dispatch(
      setFile({
        file,
        fromCamera
      })
    );
    history.push(linkToCategorise());
  };
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);

  // @ts-ignore
  const isCordova = !!window.cordova;

  return (
    <>
      <NewPhotoPage
        onPhotoClick={() => {
          isCordova
            ? history.push(linkToAddDialog())
            : inputRef && inputRef.click();
        }}
        linkToTutorialPage={linkToTutorialWithRedirect}
      />
      <input
        className="hidden"
        type="file"
        accept="image/*"
        id={"fileInput"}
        ref={setInputRef}
        onChange={(e) => {
          const file = e.target && e.target.files && e.target.files[0];
          if (file) {
            // there's probably a more direct way to figure out if the image
            // that we loaded is from the camera, but for now just check that
            // the lastModified date is < 30s ago
            const fileDate = file.lastModified;
            const ageInMinutes = (new Date().getTime() - fileDate) / 1000 / 60;
            const imgFromCamera = isNaN(ageInMinutes) || ageInMinutes < 0.5;
            handlePhotoSelect(file, imgFromCamera);
          }
        }}
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
