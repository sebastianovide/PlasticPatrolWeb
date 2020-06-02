import React from "react";

import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";

import { Item } from "../../types";

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
    marginBottom: theme.spacing(0.5)
  },
  cross: {
    marginLeft: "auto"
  }
}));

export default function ItemOverview({
  quantity,
  brand,
  type: { label },
  handleRemove,
  handleClick
}: Props) {
  const styles = useStyles();

  return (
    <div className={styles.wrapper} onClick={handleClick}>
      {quantity} {brand} {label}
      <CloseIcon
        className={styles.cross}
        onClick={(e) => {
          e.stopPropagation();
          handleRemove();
        }}
      />
    </div>
  );
}
