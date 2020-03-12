import React from "react";
import { Route } from "react-router-dom";

export default function ModeratorRoute({ user, children, path }) {
  return user && user.isModerator && <Route path>{children}</Route>;
}
