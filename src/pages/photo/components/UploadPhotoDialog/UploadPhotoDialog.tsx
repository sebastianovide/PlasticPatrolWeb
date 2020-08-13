import React, { useState } from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";

import useSendFile from "./useSendFile";
import { useHistory } from "react-router-dom";
import { linkToUploadSuccess } from "routes/upload-success/links";
import _ from "lodash";
import { Item } from "pages/photo/types";

interface Props {
  imgLocation: any;
  imgSrc: any;
  online: boolean;
  items: any;
}

export default function UploadPhotoDialog({
  imgLocation,
  imgSrc,
  online,
  items
}: Props) {
  const history = useHistory();
  const [success, setSuccess] = useState(false);
  const totalCount = _.sumBy(items, ({ quantity }: Item) => quantity);
  const { errorMessage, closeErrorDialog } = useSendFile({
    imgSrc,
    online,
    imgLocation,
    items,
    setUploadTask: (task: any) => {
      setSuccess(true);
      setTimeout(() => {
        history.push(linkToUploadSuccess(totalCount as any));
      }, 1000);
    }
  });

  return (
    <>
      <Dialog
        open={!!errorMessage}
        onClose={closeErrorDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {errorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeErrorDialog} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!errorMessage}>
        <DialogContent className={"dialogs__contentProgress"}>
          <DialogContentText id="loading-dialog-text">
            {success ? "Done." : "Initiating upload..."}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
}
