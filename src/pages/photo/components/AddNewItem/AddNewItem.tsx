import React, { useState } from "react";
import { Button, makeStyles } from "@material-ui/core";

import { Item, Type } from "../../types";
import QuantitySelector from "../QuantitySelector";
import TypeInput from "../TypeInput";

import styles from "standard.scss";

type Props = {
  onCancelClick: () => void;
  onConfirmClick: (item: Item) => void;
  initialItem?: Item;
};

const button = (theme: any) => ({
  width: 130,
  justifySelf: "center",
  marginTop: theme.spacing(1),
  "text-transform": "none"
});

const useStyles = makeStyles((theme) => ({
  brand: {
    width: "200%",
    boxSizing: "border-box",
    background: styles.lightGrey,
    color: "black",
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    border: `${styles.mediumGrey} solid 1px`,
    fontWeight: "bold",
    "&:focus": {
      outline: "none"
    }
  },
  wrapper: {
    display: "grid",
    gridTemplateAreas: `
    "type type"
    "brand brand"
    "quantityText quantitySelector"
    "cancel add"
`,
    height: "50vh",
    gridTemplateRows: "1fr min-content min-content min-content"
  },
  type: {
    gridArea: "type"
  },
  quantityText: {
    gridArea: "quantityText",
    textAlign: "center"
  },
  quantitySelector: {
    gridArea: "quantitySelector"
  },
  cancel: {
    gridArea: "cancel",
    ...button(theme)
  },
  add: {
    gridArea: "add",
    ...button(theme)
  }
}));

export default function AddNewItem({
  onCancelClick,
  onConfirmClick,
  initialItem
}: Props) {
  const [quantity, setQuantity] = useState(initialItem?.quantity || 0);
  const [type, setType] = useState<Type>(initialItem?.type || {});
  const [brand, setBrand] = useState<string>(initialItem?.brand || "");

  const styles = useStyles();

  return (
    <div className={styles.wrapper}>
      <TypeInput
        setType={setType}
        className={styles.type}
        initialType={initialItem?.type}
      />
      <input
        placeholder="Enter brand"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        type="text"
        className={styles.brand}
      />
      <p className={styles.quantityText}>Quantity</p>
      <QuantitySelector
        quantity={quantity}
        setQuantity={setQuantity}
        className={styles.quantitySelector}
      />

      <Button
        onClick={onCancelClick}
        variant="outlined"
        color="primary"
        className={styles.cancel}
      >
        Cancel
      </Button>
      <Button
        onClick={() =>
          onConfirmClick({
            quantity,
            type,
            brand
          })
        }
        variant="contained"
        color="primary"
        className={styles.add}
      >
        {initialItem ? "Edit" : "Add"} item(s)
      </Button>
    </div>
  );
}
