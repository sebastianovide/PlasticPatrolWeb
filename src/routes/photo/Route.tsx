import React from "react";
import { useHistory } from "react-router";

import PageWrapper from "components/PageWrapper";
import PhotoPageSubRouter from "./routes/SubRouter";
import { useLocation } from "react-router-dom";
import { linkToNewPhoto } from "./routes/new/links";

export default function PhotoRoute() {
  const history = useHistory();
  const location = useLocation();
  console.log(location);

  const navigationHandler =
    location.pathname === linkToNewPhoto()
      ? { handleClose: () => history.push("/") }
      : { handleBack: () => history.goBack() };

  return (
    <PageWrapper
      label={"Log your litter"}
      navigationHandler={navigationHandler}
    >
      <PhotoPageSubRouter />
    </PageWrapper>
  );
}
