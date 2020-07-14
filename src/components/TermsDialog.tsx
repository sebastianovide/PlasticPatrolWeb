import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import { tAndCLink, privatePolicyLink } from "static/info";
import { useHistory } from "react-router-dom";
import config from "custom/config";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    background: "rgba(255,225,225,0.5)"
  },
  text: {
    margin: 0
  }
}));

const TermsDialog: React.FC<{}> = () => {
  const history = useHistory();
  const [open, setOpen] = useState(
    !history.location.pathname.startsWith(config.PAGES.embeddable.path) &&
      !localStorage.getItem("TermsAccepted")
  );
  const [isChecked, setIsChecked] = useState(false);
  const classes = useStyles();

  return (
    <Dialog
      // fullScreen={fullScreen}
      classes={{ container: classes.root }}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title" style={{ textAlign: "center" }}>
        Welcome to Planet Patrol
      </DialogTitle>
      <DialogContent style={{ textAlign: "center" }}>
        <Typography className={classes.text}>Please read our</Typography>
        <a href={tAndCLink}>Terms and Conditions</a>{" "}
        <Typography className={classes.text}>and</Typography>
        <a href={privatePolicyLink}>Privacy Policy</a>
        <br /> <br />
        <FormControlLabel
          control={
            <Checkbox
              onChange={(e) => setIsChecked(e.target.checked)}
              checked={isChecked}
              color="primary"
            />
          }
          label="I have read and agree to the Terms and Conditions, and Privacy Policy."
        />
      </DialogContent>

      <DialogActions>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          disabled={!isChecked}
          onClick={() => {
            localStorage.setItem("TermsAccepted", "Yes");
            setOpen(false);
          }}
        >
          Next
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TermsDialog;
