import React from "react";
import classNames from "classnames";

import { makeStyles } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import MinusIcon from "@material-ui/icons/Remove";

const standardFlex = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const useStyles = makeStyles((theme) => ({
  quantityWrapper: {
    margin: `0 ${theme.spacing(1)}px`,
    background: "#eaeaea",
    border: "#c3c3c3 solid 1px",
    height: 30,
    width: 40,
    ...standardFlex
  },
  button: {
    background: "#eaeaea",
    border: "#c3c3c3 solid 1px"
  },
  wrapper: {
    ...standardFlex
  }
}));

type Props = {
  quantity: number;
  setQuantity: (quantity: number) => void;
  className: string;
};

export default function QuantitySelector({
  quantity,
  setQuantity,
  className
}: Props) {
  const styles = useStyles();
  return (
    <div className={classNames(styles.wrapper, className)}>
      <IconButton
        onClick={() => setQuantity(Math.max(quantity - 1, 0))}
        disableRipple
        size="small"
        className={styles.button}
      >
        <MinusIcon></MinusIcon>
      </IconButton>
      <div className={styles.quantityWrapper}>{quantity}</div>
      <IconButton
        onClick={() => setQuantity(quantity + 1)}
        disableRipple
        size="small"
        className={styles.button}
      >
        <AddIcon />
      </IconButton>
    </div>
  );
}
