import PageWrapper from "components/PageWrapper";
import CategoriesManagementPage from "pages/admin/categories/Categories";
import React from "react";
import { useHistory } from "react-router";

export default function CategoriesRoute() {
  const history = useHistory();
  return (
    <PageWrapper
      label="Categories"
      navigationHandler={{ handleBack: () => history.push("/") }}
    >
      <CategoriesManagementPage />
    </PageWrapper>
  );
}
