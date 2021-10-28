import React from "react";
import { useHistory, useLocation } from "react-router";
import { useTranslation } from "react-i18next";

import PageWrapper from "components/PageWrapper";
import PhotoPageStateProvider from "pages/photo/state";

import CategoriesProvider from "features/firebase/categories/CategoriesProvider";
import BrandsProvider from "features/firebase/brands/BrandsProvider";

import PhotoPageSubRouter from "./routes/SubRouter";
import { linkToNewPhoto } from "./routes/new/links";
import config from "../../custom/config";

export default function PhotoRoute() {
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();

  const navigationHandler =
    location.pathname === linkToNewPhoto()
      ? { handleClose: () => history.push("/") }
      : { handleBack: () => history.goBack(), confirm: true };

  return (
    <PhotoPageStateProvider>
      <CategoriesProvider>
        <BrandsProvider>
          <PageWrapper
            label={t(config.PAGES.photo.label)}
            navigationHandler={navigationHandler}
          >
            <PhotoPageSubRouter />
          </PageWrapper>
        </BrandsProvider>
      </CategoriesProvider>
    </PhotoPageStateProvider>
  );
}
