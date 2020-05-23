import React, { useState } from "react";

import { Item } from "../ItemOverview";
import QuantitySelector from "../QuantitySelector/QuantitySelector";
import { Button } from "@material-ui/core";

type Props = {
  onCancelClick: () => void;
  onAddClick: (item: Item) => void;
};

export default function AddNewItem({ onCancelClick, onAddClick }: Props) {
  const [quantity, setQuantity] = useState(0);
  const [type, setType] = useState<string>("");
  const [brand, setBrand] = useState<string>("");

  return (
    <div>
      <input
        placeholder="Enter brand"
        value={brand}
        onChange={e => setBrand(e.target.value)}
        type="text"
      />
      <div>
        Quantity{" "}
        <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
      </div>
      <Button onClick={onCancelClick} variant="contained" color="secondary">
        Cancel
      </Button>
      <Button
        onClick={() =>
          onAddClick({
            quantity,
            type,
            brand
          })
        }
        variant="contained"
        color="primary"
      >
        Add item(s)
      </Button>
    </div>
  );
}
