import React, { ReactElement } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Logo, { COLORS } from "components/common/Logo";

const useStyles = makeStyles(() => ({
  wrapper: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    margin: "0 10vw"
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    height: "90%",
    marginBottom: "25px"
  },
  title: {
    textTransform: "uppercase",
    fontSize: "1.3em"
  },
  logo: {
    height: "15vh",
    marginTop: "5vh"
  }
}));

type Props = { children: ReactElement; title: string };
export default function SlideLayout({ children, title }: Props) {
  const styles = useStyles();

  return (
    <div className={styles.wrapper}>
      <Logo fill={COLORS.WHITE} className={styles.logo} />
      <div className={styles.container}>
        <h1 className={styles.title}>{title}</h1>
        {children}
      </div>
    </div>
  );
}
