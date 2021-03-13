import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import linkToCategories from "./categories/link";
import CategoriesRoute from "./categories/Route";

export default function AdminRouter() {
  return (
    <Switch>
      <Route path={linkToCategories()}>
        <CategoriesRoute />
      </Route>

      <Redirect to={"/"} />
    </Switch>
  );
}
