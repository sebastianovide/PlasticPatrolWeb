import React, { useState } from "react";
import { Button, makeStyles } from "@material-ui/core";

import { Item, SuggestionBasedText } from "../../types";
import QuantitySelector from "../QuantitySelector";
import SuggestionBasedInput from "../SuggestionBasedInput";

import styles from "standard.module.scss";
import { useCategoriesJson } from "features/firebase/categories/CategoriesProvider";
import { useBrands } from "features/firebase/brands/BrandsProvider";
import { useTranslation } from "react-i18next";

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

declare global {
  interface Window {
    cordova?: any;
  }
}

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
  wrapper: {
    display: "grid",
    gridTemplateAreas: `
    "category category"
    "brand brand"
    "quantityText quantitySelector"
    "cancel add"
`,
    height: "50%",
    gridTemplateColumns: "50%",
    gridTemplateRows: "1fr min-content min-content min-content",
    maxWidth: window.outerWidth - theme.spacing(2)
  },
  category: {
    gridArea: "category"
  },
  brand: {
    gridArea: "brand"
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
  const [category, setCategory] = useState<SuggestionBasedText>(
    initialItem?.category || { label: null, id: null }
  );
  const [brand, setBrand] = useState<SuggestionBasedText>(
    initialItem?.brand || { label: null, id: null }
  );

  const styles = useStyles();
  const { t } = useTranslation();

  const itemButtonIsDisabled = !(quantity && category && category.label);

  const categories = useCategoriesJson();
  const brands = useBrands();

  return (
    <div className={styles.wrapper}>
      <div>
        <SuggestionBasedInput
          sourceData={categories}
          inputPrompt={t("record_litter_type_placeholder")}
          callback={setCategory}
          initialLabel={initialItem?.category?.label || ""}
          className={styles.category}
        />
        <SuggestionBasedInput
          sourceData={brands}
          inputPrompt={t("record_litter_brand_placeholder")}
          callback={setBrand}
          initialLabel={initialItem?.brand?.label || ""}
          className={styles.brand}
        />
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
        {t("cancel_button_text")}
      </Button>
      <Button
        disabled={itemButtonIsDisabled}
        onClick={() =>
          onConfirmClick({
            quantity,
            category,
            brand
          })
        }
        variant="contained"
        color="primary"
        className={styles.add}
      >
        {initialItem
          ? t("record_litter_edit_item_button_text")
          : t("record_litter_add_item_button_text")}
      </Button>
    </div>
  );
}
