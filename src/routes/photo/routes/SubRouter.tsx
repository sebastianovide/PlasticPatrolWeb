import React from "react";
import { Route, Redirect } from "react-router";

import { linkToNewPhoto } from "./new/links";
import NewPhotoRoute from "./new/Route";

export default function PhotoPageSubRouter() {
  return (
    <>
      <Route link={linkToNewPhoto()}>
        <NewPhotoRoute />
      </Route>
      <Redirect to={linkToNewPhoto()} />
    </>
  );
}
