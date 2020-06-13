import React, { useState } from "react";
import { useHistory } from "react-router";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CircularProgress from "@material-ui/core/CircularProgress";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";

import { authFirebase } from "features/firebase";

import { isIphoneWithNotchAndCordova, isIphoneAndCordova } from "utils";
import User from "types/User";

const useStyles = makeStyles((theme) => ({
  typography: {
    ...theme.mixins.gutters(),
    whiteSpace: "pre-wrap",
    paddingRight: 0,
    paddingLeft: 0
  },
  iconButton: {
    marginRight: theme.spacing(2)
  },
  link: {
    cursor: "pointer",
    color: theme.palette.secondary.main
  },
  button: {
    margin: theme.spacing(1.5)
  },
  list: {
    paddingLeft: theme.spacing(2)
  },
  notchTop: {
    paddingTop: isIphoneWithNotchAndCordova()
      ? "env(safe-area-inset-top)"
      : isIphoneAndCordova
      ? theme.spacing(1.5)
      : ""
  },
  notchBottom: {
    paddingBottom: isIphoneWithNotchAndCordova()
      ? "env(safe-area-inset-bottom)"
      : 0
  }
}));

type Message = { title: string; body: string };
type HandleNextClick = () => Promise<Message>;

type Props = { user?: User; handleNextClick: HandleNextClick; open: boolean };
export default function EmailVerifiedDialog({ user, open, ...props }: Props) {
  const styles = useStyles();
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState<string | null | undefined>();
  const [message, setMessage] = useState<string | null | undefined>();

  const handleNextClick = async () => {
    setLoading(true);
    const message = await props.handleNextClick();
    setLoading(false);
    setTitle(message.title);
    setMessage(message.body);
  };

  const handleResendEmail = async () => {
    setLoading(true);

    const message = await authFirebase.sendEmailVerification();
    setLoading(false);
    setTitle(message.title);
    setMessage(message.body);
  };

  const handleCloseConfirmationDialog = () => {
    setTitle(null);
    setMessage(null);
  };

  const handleSignOut = async () => {
    await authFirebase.signOut();

    history.push("/");
  };

  return user ? (
    <>
      <Dialog open={open}>
        <AppBar position="static" className={styles.notchTop}>
          <Toolbar>
            <CloseIcon className={styles.iconButton} onClick={handleSignOut} />
            <Typography variant="h6" color="inherit">
              Email Verification
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent style={{ fontFamily: "Arial" }}>
          <Typography variant={"subtitle1"} className={styles.typography}>
            <p>
              A verification email has been sent to <b>{user.email}</b>. Please
              click on the link in the email to activate your account.
            </p>
            Once you have activated your account, click next to proceed to the
            app.
            <br />
            <ul className={styles.list}>
              <li>
                {" "}
                If you haven’t received your verification email, check your spam
                folder or click
                <b className={styles.link} onClick={handleResendEmail}>
                  {" "}
                  here
                </b>{" "}
                to resend it.
              </li>
              <li>
                To carry on without activating your account, click
                <b className={styles.link} onClick={handleSignOut}>
                  {" "}
                  sign out
                </b>
                . Some features may not be available until you activate your
                account.
              </li>
            </ul>
            <br />
          </Typography>
        </DialogContent>
        <DialogActions color="primary">
          <Button
            className={styles.button}
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleNextClick}
          >
            Next
          </Button>
        </DialogActions>
        <div className={styles.notchBottom} />
      </Dialog>

      <Dialog
        open={loading}
        PaperProps={{
          style: { backgroundColor: "transparent", boxShadow: "none" }
        }}
      >
        <CircularProgress color="primary" />
      </Dialog>

      <Dialog open={!!title}>
        <DialogTitle
          id="responsive-dialog-title"
          style={{ textAlign: "center" }}
        >
          {title}
        </DialogTitle>
        <DialogContent style={{ fontFamily: "Arial" }}>
          <Typography variant={"subtitle1"} className={styles.typography}>
            {message}
          </Typography>
        </DialogContent>
        <DialogActions color="primary">
          <Button
            className={styles.button}
            fullWidth
            color="primary"
            variant="contained"
            onClick={handleCloseConfirmationDialog}
          >
            Close
          </Button>
        </DialogActions>
        <div className={styles.notchBottom} />
      </Dialog>
    </>
  ) : null;
}
