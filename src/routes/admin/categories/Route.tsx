import PageWrapper from "components/PageWrapper";
import CategoriesManagementPage from "pages/admin/categories/Categories";
import React from "react";

export default function CategoriesRoute() {
  return (
    <PageWrapper
      label="Categories"
      navigationHandler={{ handleBack: () => {} }}
    >
      <CategoriesManagementPage />
    </PageWrapper>
  );
}
