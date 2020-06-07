import React from "react";
import { makeStyles } from "@material-ui/core";

import logo from "assets/images/plasticPatrolLogoTeal.png";

const useStyles = makeStyles((theme) => ({
  logo: {
    height: "80px",
    width: "120px",
    margin: theme.spacing(2),
    marginLeft: "auto",
    marginRight: "auto"
  }
}));

export default function Logo() {
  const styles = useStyles();
  return <img className={styles.logo} src={logo} alt={"Planet Patrol"} />;
}
