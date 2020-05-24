import React, { FunctionComponent, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CloseIcon from "@material-ui/icons/Close";
import BackIcon from "@material-ui/icons/ArrowBack";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import standardStyles from "standard.scss";

import { isIphoneWithNotchAndCordova, isIphoneAndCordova } from "../utils";

const placeholderImage = process.env.PUBLIC_URL + "/custom/images/banner.svg";

declare global {
  interface Window {
    StatusBar: {
      styleDefault: () => void;
      styleLightContent: () => void;
    };
  }
}

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    height: "100%",
    width: "100vw",
    position: "fixed",
    right: 0,
    left: 0,
    bottom: 0
  },
  main: {
    marginBottom: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    flex: 1,
    height: "100%",
    overflowY: "auto",

    "-webkit-overflow-scrolling": "touch"
  },
  iconButton: {
    marginRight: 20
  },
  grow: {
    flexGrow: 1
  },
  notchTop: {
    paddingTop: isIphoneWithNotchAndCordova()
      ? "env(safe-area-inset-top)"
      : isIphoneAndCordova
      ? theme.spacing(1.5)
      : undefined
  },
  notchBottom: {
    paddingBottom: isIphoneWithNotchAndCordova()
      ? "env(safe-area-inset-bottom)"
      : "0px"
  },
  logo: {
    height: "80px",
    margin: theme.spacing(2)
  },
  button: {
    color: theme.palette.primary.contrastText
  },
  buttonDisabled: {
    color: `${standardStyles.primaryTextDisabled} !important`
  }
}));

interface Props {
  label: string;
  hasLogo?: boolean;
  handleClose: () => void;
}

interface PhotoPageProps {
  handlePrev: () => void;
  handleNext?: () => void;
  enableNext: boolean;
  nextClicked: boolean;
  error: boolean;
  sendFile: () => void;
  label: string;
  handleClose: () => void;
}

const useStatusBarHighlighting = () => {
  const theme = useTheme();
  useEffect(() => {
    const palette = theme.palette;
    if (isIphoneAndCordova && palette.primary.main === palette.common.black) {
      window.StatusBar.styleDefault();
    }

    // on unmount, set to styleLightContent
    return () => {
      const palette = theme.palette;
      if (isIphoneAndCordova && palette.primary.main === palette.common.black) {
        window.StatusBar.styleLightContent();
      }
    };
  });
};

export const PhotoPageWrapper: FunctionComponent<PhotoPageProps> = ({
  handlePrev,
  handleNext,
  enableNext,
  nextClicked,
  error,
  sendFile,
  label,
  handleClose,
  children
}) => {
  const classes = useStyles();
  useStatusBarHighlighting();
  return (
    <div className={classes.container}>
      <AppBar position="static" className={classes.notchTop}>
        <Toolbar>
          {nextClicked ? (
            <BackIcon className={classes.iconButton} onClick={handlePrev} />
          ) : (
            <CloseIcon className={classes.iconButton} onClick={handleClose} />
          )}
          <Typography className={classes.grow} variant="h6" color="inherit">
            {label}
          </Typography>
          {!nextClicked && (
            <Button
              disabled={!enableNext}
              className={classes.button}
              onClick={handleNext}
              classes={{ disabled: classes.buttonDisabled }}
            >
              Next
            </Button>
          )}
          {nextClicked && (
            <Button
              disabled={error}
              className={classes.button}
              onClick={sendFile}
              classes={{ disabled: classes.buttonDisabled }}
            >
              Upload
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <div className={classes.main}>{children}</div>
      <div className={classes.notchBottom} />
    </div>
  );
};

const PageWrapper: FunctionComponent<Props> = ({
  children,
  label,
  hasLogo,
  handleClose
}) => {
  const classes = useStyles();
  useStatusBarHighlighting();

  return (
    <div className={classes.container}>
      <AppBar position="static" className={classes.notchTop}>
        <Toolbar>
          <CloseIcon className={classes.iconButton} onClick={handleClose} />
          <Typography className={classes.grow} variant="h6" color="inherit">
            {label}
          </Typography>
        </Toolbar>
      </AppBar>
      {hasLogo === true && (
        <img
          className={classes.logo}
          src={placeholderImage}
          alt={"Geovation"}
        />
      )}
      <div className={classes.main}>{children}</div>
      <div className={classes.notchBottom} />
    </div>
  );
};

export default PageWrapper;
