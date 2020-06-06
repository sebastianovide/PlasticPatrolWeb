import React from "react";
import { useHistory } from "react-router-dom";

import Login from "pages/dialogs/Login";

export default function LoginRoute() {
  const history = useHistory();

  return <Login handleClose={() => history.push("/")} />;
}
