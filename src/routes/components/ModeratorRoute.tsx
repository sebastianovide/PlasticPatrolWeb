import React from "react";
import { Route } from "react-router-dom";

import User from "types/User";

type Props = {
  user: User;
  path: string;
  children: React.ReactElement;
};

export default function ModeratorRoute({ user, children, path }: Props) {
  const isModerator = user && user.isModerator;
  return isModerator ? <Route path={path}>{children}</Route> : null;
}
