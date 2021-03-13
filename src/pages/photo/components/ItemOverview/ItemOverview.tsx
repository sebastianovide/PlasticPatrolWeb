import React, { useState } from "react";

import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";

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
  brand,
  category: { label },
  handleRemove,
  handleClick
}: Props) {
  const styles = useStyles();
  const [confirmRemove, setConfirmRemove] = useState(false);

  return (
    <div className={styles.wrapper} onClick={handleClick}>
      {quantity} {brand} {label}
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
            Are you sure you want to remove this label?
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
            Cancel
          </Button>
          <Button
            onClick={(e) => {
              handleRemove();
              e.stopPropagation();
            }}
            color="primary"
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
