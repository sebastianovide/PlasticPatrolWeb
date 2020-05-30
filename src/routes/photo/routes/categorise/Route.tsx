import React from "react";
import CategoriseLitterPage from "pages/photo/pages/CategorisePhotoPage";
import { useParams } from "react-router-dom";

export default function CategorisePhotoRoute() {
  const { fileName } = useParams();
  return <CategoriseLitterPage />;
}
