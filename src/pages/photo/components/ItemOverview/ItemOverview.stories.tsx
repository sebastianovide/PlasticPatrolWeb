// @ts-nocheck
import React from "react";

import ItemOverview from "./ItemOverview";

export default { title: "ItemOverview", component: ItemOverview };

export const withAllFields = () => (
  <ItemOverview
    quantity={1}
    brand={"Coca cola"}
    type={{ label: "Plastic bottle", leafKey: null }}
    handleRemove={() => {}}
  />
);

export const withoutBrand = () => (
  <ItemOverview
    quantity={1}
    type={{ label: "Plastic bottle", leafKey: null }}
    handleClick={() => {}}
    handleRemove={() => {}}
  />
);
