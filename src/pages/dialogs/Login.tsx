import React, { useRef, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import LoginFirebase from "components/LoginFirebase";

type Props = { handleClose: () => void };

const useStyles = makeStyles((theme) => ({
  title: {
    padding: theme.spacing(2),
    margin: 0
  }
}));
export default function Login({ handleClose }: Props) {
  const styles = useStyles();
  const redirectOnSuccess = useGetRedirectOnSuccess();

  const [showPreLoginMessage, setShow] = useState(!!redirectOnSuccess);

  return (
    <>
      <Dialog open={showPreLoginMessage} onClose={handleClose}>
        <DialogTitle disableTypography className={styles.title}>
          <Typography variant="h6">Please login to add a photo</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Before adding photos, you must be logged into your account.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => setShow(false)} color="primary">
            Login
          </Button>
        </DialogActions>
      </Dialog>

      <LoginFirebase
        open={!showPreLoginMessage}
        handleClose={handleClose}
        onSignIn={redirectOnSuccess ? redirectOnSuccess : handleClose}
      />
    </>
  );
}

function useGetRedirectOnSuccess() {
  const location = useLocation<{ redirectToOnSuccess?: string }>();
  const locationRef = useRef(location);
  const locationState = locationRef.current.state;
  const redirectToOnSuccess =
    locationState && locationState.redirectToOnSuccess;
  const history = useHistory();

  if (redirectToOnSuccess) {
    return () => history.push(redirectToOnSuccess);
  }

  return false;
}
