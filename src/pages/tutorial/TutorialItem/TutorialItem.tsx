import React from "react";
import { makeStyles } from "@material-ui/core";
import { useTranslation } from "react-i18next";

import { TutorialStep } from "../static";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    alignItems: "center",
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
    margin: `0 ${theme.spacing(1)}px`,
    textAlign: "center",
    boxShadow: "0 0 8px #cccccc",
    backgroundColor: "#f3f3f3",
    boxSizing: "border-box",
    justifyContent: "space-around"
  },
  icon: { fontSize: "3rem" },
  image: { maxWidth: "80%", height: "auto", maxHeight: 200 }
}));

type Props = TutorialStep & { stepNumber: number };

export default function TutorialItem({
  stepNumber,
  Icon,
  text,
  title,
  img,
  Button
}: Props) {
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      {Icon && <Icon className={styles.icon} />}
      {title && (
        <h3>
          {t("tutorial_item_step_placeholder")} {stepNumber}: {title}
        </h3>
      )}
      <p>{text}</p>
      {img && <img src={img} className={styles.image} alt="" />}
      {Button && <Button />}
    </div>
  );
}
