import PageWrapper from "components/PageWrapper";
import BrandsManagementPage from "pages/admin/brands/Brands";
import React from "react";

export default function BrandsRoute() {
  return (
    <PageWrapper label="Brands" navigationHandler={{ handleBack: () => {} }}>
      <BrandsManagementPage />
    </PageWrapper>
  );
}
