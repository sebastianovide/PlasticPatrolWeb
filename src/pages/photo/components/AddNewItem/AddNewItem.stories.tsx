import React from "react";

import AddNewItem from "./AddNewItem";

export default { title: "AddNewItem", component: AddNewItem };

const item: any = {};
export const defaultSelector = () => (
  <AddNewItem
    onCancelClick={() => {}}
    onConfirmClick={(item) => {
      console.log(item);
    }}
  />
);
