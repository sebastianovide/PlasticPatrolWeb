import React from "react";
import { Route } from "react-router-dom";

export default function SignedInRoute({ user, children, path }) {
  return user && <Route path>{children}</Route>;
}
