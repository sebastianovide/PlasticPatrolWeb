import React, { useState } from "react";
import { Route, useHistory } from "react-router-dom";

import { NewPhotoPage } from "pages/photo";
import AddPhotoDialog from "pages/photo/components/AddPhotoDialog";

import { linkToAddDialog } from "./links";
import { linkToCategoriseWithState } from "../categorise/links";
import { CordovaCameraImage } from "types/Photo";

export default function NewPhotoRoute() {
  const history = useHistory();
  const handlePhotoSelect = (
    file: File | CordovaCameraImage,
    fromCamera: boolean
  ) => history.push(linkToCategoriseWithState(file, fromCamera));
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
