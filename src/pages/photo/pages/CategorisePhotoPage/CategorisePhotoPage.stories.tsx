// @ts-nocheck

import React from "react";

import { CategoriseLitterPageWithFileInfo as PhotoPage } from "./CategorisePhotoPage";
import { HashRouter as Router } from "react-router-dom";

export default { title: "PhotoPage", component: PhotoPage };

const dataProps = {
  photo: {
    imgSrc:
      "https://images.pexels.com/photos/802221/pexels-photo-802221.jpeg?cs=srgb&dl=assorted-plastic-bottles-802221.jpg&fm=jpg"
  }
};

export const logLitterPage = () => (
  <Router>
    <PhotoPage {...dataProps} />
  </Router>
);
