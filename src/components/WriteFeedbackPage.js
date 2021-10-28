// let the user write a feedback.

import React, { useState } from "react";
import firebase from "firebase/app";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";

import { dbFirebase } from "features/firebase";

import { feedbackEmail } from "static/info";

import { device } from "../utils";
import PageWrapper from "./PageWrapper";

const styles = (theme) => ({
  content: {
    height: "100%",
    overflow: "auto",
    "-webkit-overflow-scrolling": "touch",
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
    marginLeft: theme.spacing(1.5),
    marginRight: theme.spacing(1.5)
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: theme.spacing(1.5)
  }
});

const WriteFeedbackPage = (props) => {
  const { classes, handleClose, label, location, online, user } = props;
  const { t } = useTranslation();
  const [email, setEmail] = useState(user ? user.email : "");
  const [emailHelperText, setEmailHelperText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState();

  const handleEmailChange = (event) => {
    const email = event.target.value;
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/;

    if (email && !email.match(emailRegex)) {
      setEmail(email);
      setEmailHelperText(t("feedback_email_helper_text"));
    } else {
      setEmail(email);
      setEmailHelperText("");
    }
  };

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  const openDialog = (message, isError) => {
    setSending(false);
    setOpen(true);
    setMessage(message);
    setIsError(isError);
  };

  const closeDialog = () => {
    setOpen(false);
    if (!isError) {
      handleClose();
    }
  };

  const sendFeedback = () => {
    setSending(true);

    let data = {};
    data.feedback = feedback;
    data.resolved = false;
    data.appVersion = process.env.REACT_APP_VERSION;
    data.buildNumber = process.env.REACT_APP_BUILD_NUMBER;
    data.email = email ? email : "anonymous";
    data.device = device();
    data.userAgent = navigator.userAgent;
    data.created = firebase.default.firestore.FieldValue.serverTimestamp();
    data.updated = data.created;
    if (location) {
      data.latitude = location.latitude;
      data.longitude = location.longitude;
    }

    dbFirebase
      .writeFeedback(data)
      .then((res) => {
        setSending(false);
        openDialog(t("feedback_dialog_sent_text"));
      })
      .catch((err) => {
        console.log(err.toString());
        openDialog(t("feedback_dialog_error_text", { feedbackEmail }), true);
      });
  };

  return (
    <PageWrapper label={t(label)} navigationHandler={{ handleClose }}>
      <div className={classes.content}>
        <TextField
          fullWidth
          id="filled-email-input"
          label={t("feedback_email_label")}
          placeholder="aa@bb.com"
          error={!!emailHelperText}
          helperText={emailHelperText}
          type="email"
          name="email"
          autoComplete="email"
          margin="normal"
          variant="filled"
          onChange={handleEmailChange}
          value={email}
        />
        <TextField
          fullWidth
          id="feedback-textfield"
          placeholder={t("feedback_placeholder")}
          onChange={handleFeedbackChange}
          value={feedback}
          autoFocus
          variant="filled"
          type="string"
          required
          margin="dense"
          rows={
            window.innerHeight > 667
              ? 23
              : window.innerHeight > 640
              ? 19
              : window.innerHeight > 480
              ? 11
              : 9
          }
          rowsMax={
            window.innerHeight > 667
              ? 24
              : window.innerHeight > 640
              ? 20
              : window.innerHeight > 480
              ? 12
              : 10
          }
          multiline
        />
      </div>
      <div className={classes.button}>
        <Button
          color="primary"
          fullWidth
          disabled={!!emailHelperText || !feedback || !online}
          variant="contained"
          onClick={sendFeedback}
        >
          {t("feedback_send_button_text")}
        </Button>
      </div>

      <Dialog
        open={open}
        onClose={closeDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            {t("ok_button_text")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={sending}>
        <DialogContent>
          <DialogContentText id="loading-dialog-text">
            {t("feedback_sending_text")}
          </DialogContentText>
          <CircularProgress
            className={classes.progress}
            color="primary"
            size={50}
            thickness={6}
          />
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
};

export default withStyles(styles)(WriteFeedbackPage);
