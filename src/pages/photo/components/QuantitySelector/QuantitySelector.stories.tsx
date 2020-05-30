// @ts-nocheck

import React, { useState } from "react";

import QuantitySelector from "./QuantitySelector";

export default { title: "Quantity Selector", component: QuantitySelector };

function Q() {
  const [quantity, setQuantity] = useState(0);

  return <QuantitySelector quantity={quantity} setQuantity={setQuantity} />;
}
export const defaultSelector = () => <Q />;
