import React from "react";
import { Route, Redirect, Switch } from "react-router";

import { linkToNewPhoto } from "./new/links";
import NewPhotoRoute from "./new/Route";
import { linkToCategorise } from "./categorise/links";
import CategorisePhotoRoute from "./categorise/Route";

export default function PhotoPageSubRouter() {
  return (
    <Switch>
      <Route path={linkToCategorise()}>
        <CategorisePhotoRoute />
      </Route>
      <Route path={linkToNewPhoto()}>
        <NewPhotoRoute />
      </Route>
      <Redirect to={linkToNewPhoto()} />
    </Switch>
  );
}
