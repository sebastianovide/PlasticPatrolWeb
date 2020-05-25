import React from "react";
import { Route, useHistory } from "react-router-dom";

import { NewPhotoPage } from "pages/photo";
import AddPhotoDialog from "pages/photo/components/AddPhotoDialog";

import { linkToAddDialog } from "./links";

export default function NewPhotoRoute() {
  const history = useHistory();
  return (
    <>
      <NewPhotoPage onPhotoClick={() => history.push(linkToAddDialog())} />
      <Route path={linkToAddDialog()}>
        <AddPhotoDialog
          onClose={() => history.goBack()}
          handleListItemClick={(item: string) => {}}
        />
      </Route>
    </>
  );
}
