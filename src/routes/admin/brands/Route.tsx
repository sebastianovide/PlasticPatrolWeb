import PageWrapper from "components/PageWrapper";
import BrandsManagementPage from "pages/admin/brands/Brands";
import React from "react";
import { useHistory } from "react-router";

export default function BrandsRoute() {
  const history = useHistory();
  return (
    <PageWrapper
      label="Brands"
      navigationHandler={{ handleBack: () => history.push("/") }}
    >
      <BrandsManagementPage />
    </PageWrapper>
  );
}
