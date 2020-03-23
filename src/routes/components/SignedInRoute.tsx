import React from "react";
import { Route } from "react-router-dom";

import User from "types/User";

type Props = {
  user: User;
  path: string;
  children: React.ReactElement;
};

export default function SignedInRoute({ user, children, path }: Props) {
  return user ? <Route path={path}>{children}</Route> : null;
}
