import React, { useState } from "react";
import { Button, makeStyles } from "@material-ui/core";

import { Item } from "../ItemOverview";
import QuantitySelector from "../QuantitySelector";
import TypeInput from "../TypeInput";

import styles from "standard.scss";

type Props = {
  onCancelClick: () => void;
  onAddClick: (item: Item) => void;
};

const button = (theme: any) => ({
  width: 130,
  justifySelf: "center",
  marginTop: theme.spacing(1),
  textTransform: "none"
});

const useStyles = makeStyles(theme => ({
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

export default function AddNewItem({ onCancelClick, onAddClick }: Props) {
  const [quantity, setQuantity] = useState(0);
  const [type, setType] = useState<string | null>("");
  const [brand, setBrand] = useState<string>("");

  const styles = useStyles();

  return (
    <div className={styles.wrapper}>
      <TypeInput setLeafKey={setType} className={styles.type} />
      <input
        placeholder="Enter brand"
        value={brand}
        onChange={e => setBrand(e.target.value)}
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
        variant="contained"
        color="secondary"
        className={styles.cancel}
      >
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
        className={styles.add}
      >
        Add item(s)
      </Button>
    </div>
  );
}
