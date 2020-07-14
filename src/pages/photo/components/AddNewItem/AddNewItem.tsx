import React, { useState } from "react";
import { Button, makeStyles } from "@material-ui/core";

import { Item, Type } from "../../types";
import QuantitySelector from "../QuantitySelector";
import BusinessIcon from "@material-ui/icons/Business";
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
  brandWrapper: {
    display: "flex",
    alignItems: "center",
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
  brand: {
    border: "none",
    background: styles.lightGrey,
    color: "black",
    fontWeight: "bold",
    marginLeft: theme.spacing(1),
    fontSize: 11,
    width: "100%",
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
    height: "50%",
    gridTemplateColumns: "50%",
    gridTemplateRows: "1fr min-content min-content min-content",
    maxWidth: window.outerWidth - theme.spacing(2)
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

  const itemButtonIsDisabled = !(quantity && type && type.label);

  return (
    <div className={styles.wrapper}>
      <div>
        <TypeInput
          setType={setType}
          className={styles.type}
          initialType={initialItem?.type}
        />
        <div className={styles.brandWrapper}>
          <BusinessIcon />
          <input
            placeholder="Enter brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            type="text"
            className={styles.brand}
          />
        </div>
      </div>
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
        disabled={itemButtonIsDisabled}
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
