import React, { useState } from "react";

import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { Item } from "../../types";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@material-ui/core";

type Props = {
  handleRemove: () => void;
  handleClick: () => void;
} & Item;

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: "flex",
    alignItems: "center",
    background: "#4e4e4e",
    color: "white",
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    marginBottom: theme.spacing(0.5),
    minHeight: "30px"
  },
  cross: {
    marginLeft: "auto"
  }
}));

export default function ItemOverview({
  quantity,
  brand: { label: brandLabel },
  category: { label: categoryLabel },
  handleRemove,
  handleClick
}: Props) {
  const styles = useStyles();
  const { t } = useTranslation();
  const [confirmRemove, setConfirmRemove] = useState(false);

  return (
    <div className={styles.wrapper} onClick={handleClick}>
      {quantity} {brandLabel} {categoryLabel}
      <CloseIcon
        className={styles.cross}
        onClick={(e) => {
          e.stopPropagation();
          setConfirmRemove(true);
        }}
      />
      <Dialog
        open={confirmRemove}
        onClose={() => setConfirmRemove(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("record_litter_remove_details_prompt_text")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(e) => {
              setConfirmRemove(false);
              e.stopPropagation();
            }}
            color="primary"
          >
            {t("cancel_button_text")}
          </Button>
          <Button
            onClick={(e) => {
              handleRemove();
              e.stopPropagation();
            }}
            color="primary"
          >
            {t("remove_button_text")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
