import React, { useState } from "react";

import AddNewItem from "./AddNewItem";

export default { title: "AddNewItem", component: AddNewItem };

export const defaultSelector = () => (
  <AddNewItem onCancelClick={() => {}} onAddClick={() => {}} />
);
