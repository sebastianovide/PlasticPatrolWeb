import React from "react";
import { Route, useHistory } from "react-router-dom";

import { NewPhotoPage } from "pages/photo";
import AddPhotoDialog from "pages/photo/components/AddPhotoDialog";

import { linkToAddDialog } from "./links";
import { linkToCategoriseWithState } from "../categorise/links";

export default function NewPhotoRoute() {
  const history = useHistory();
  const handlePhotoSelect = (file: string | File) =>
    history.push(linkToCategoriseWithState(file));

  return (
    <>
      <NewPhotoPage onPhotoClick={() => history.push(linkToAddDialog())} />
      <Route path={linkToAddDialog()} exact>
        <AddPhotoDialog
          onClose={() => history.goBack()}
          handlePhotoSelect={handlePhotoSelect}
        />
      </Route>
    </>
  );
}
