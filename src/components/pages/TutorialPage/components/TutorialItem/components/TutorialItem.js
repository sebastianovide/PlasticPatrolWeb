import React from "react";
import { makeStyles } from "@material-ui/core";

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

const TutorialItem = ({ stepNumber, Icon, text, title, img, Button }) => {
  const styles = useStyles();

  return (
    <div className={styles.wrapper}>
      {Icon && <Icon className={styles.icon} />}
      {title && (
        <h3>
          Step {stepNumber}: {title}
        </h3>
      )}
      <p>{text}</p>
      {img && <img src={img} className={styles.image} alt="" />}
      {Button && <Button />}
    </div>
  );
};
export default TutorialItem;
