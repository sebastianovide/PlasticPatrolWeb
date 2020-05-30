import React, { useState } from "react";
import { Route, useHistory } from "react-router-dom";

import { NewPhotoPage } from "pages/photo";
import AddPhotoDialog from "pages/photo/components/AddPhotoDialog";

import { linkToAddDialog } from "./links";
import { linkToCategoriseWithState } from "../categorise/links";

export default function NewPhotoRoute() {
  const history = useHistory();
  const handlePhotoSelect = (file: string | File) =>
    history.push(linkToCategoriseWithState(file));
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
            handlePhotoSelect(file);
          }
        }}
      />
      <Route path={linkToAddDialog()} exact>
        <AddPhotoDialog
          onClose={() => history.goBack()}
          handlePhotoSelect={handlePhotoSelect}
        />
      </Route>
    </>
  );
}
