import React from "react";
import { Link } from "react-router-dom";

import { Button, makeStyles } from "@material-ui/core";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";

import styles from "standard.scss";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    padding: theme.spacing(3)
  },
  icon: {
    color: "white",
    fontSize: "25vh"
  },
  text: {
    textAlign: "center"
  },
  button: {
    height: "50%",
    background: styles.lightGrey,
    border: `${styles.mediumGrey} solid 1px`,
    "&:focus": { background: styles.lightGrey }
  }
}));

type Props = {
  onPhotoClick: () => void;
  linkToTutorialPage: () => string | Object;
};
export default function NewPhotoPage({
  onPhotoClick,
  linkToTutorialPage
}: Props) {
  const styles = useStyles();

  return (
    <>
      <div className={styles.wrapper}>
        <Button className={styles.button} disableRipple onClick={onPhotoClick}>
          <AddAPhotoIcon className={styles.icon} />
        </Button>
        <div className={styles.text}>
          <p>Tap on the button above to add a photo of your cleanup.</p>

          <p>Make sure items are clearly visible in the photo.</p>
          <p>
            If you would like to see an example, please check out the{" "}
            <Link to={linkToTutorialPage()}>tutorial</Link>.
          </p>
        </div>
      </div>
    </>
  );
}
