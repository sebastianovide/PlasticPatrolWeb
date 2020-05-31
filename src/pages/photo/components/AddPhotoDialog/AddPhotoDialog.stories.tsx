// @ts-nocheck
import React from "react";

import AddPhotoDialog from "./AddPhotoDialog";

export default { title: "AddPhotoDialog", component: AddPhotoDialog };

export const addPhotoDialog = () => (
  <AddPhotoDialog onClose={() => {}} handlePhotoSelect={() => {}} />
);
