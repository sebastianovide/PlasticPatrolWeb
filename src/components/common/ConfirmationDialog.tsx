import React from "react";
import { Dialog, DialogTitle, Button, DialogActions } from "@material-ui/core";

export type Confirmation = {
  message: string;
  onConfirmation: () => void;
};

type Props = {
  confirmation?: Confirmation;
  setConfirmation: (confirmation: Confirmation | undefined) => void;
};

const ConfirmationDialog: React.FC<Props> = ({
  confirmation,
  setConfirmation
}: Props) => {
  if (!confirmation) {
    return null;
  }

  return (
    <Dialog open={true} onClose={() => setConfirmation(undefined)}>
      <DialogTitle>{confirmation.message}</DialogTitle>
      <DialogActions>
        <Button onClick={() => setConfirmation(undefined)} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            setConfirmation(undefined);
            confirmation.onConfirmation();
          }}
          color="primary"
        >
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
