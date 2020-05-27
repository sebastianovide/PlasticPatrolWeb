import React from "react";
import { useHistory } from "react-router";

import PageWrapper from "components/PageWrapper";
import PhotoPageSubRouter from "./routes/SubRouter";

export default function PhotoRoute() {
  const history = useHistory();

  return (
    <PageWrapper label={"Log your litter"} handleClose={history.goBack}>
      <PhotoPageSubRouter />
    </PageWrapper>
  );
}
