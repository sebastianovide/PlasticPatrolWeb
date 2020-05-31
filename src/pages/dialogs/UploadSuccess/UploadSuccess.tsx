import React from "react";

import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core";

type Props = {
  numberOfPiecesSubmitted: number;
  totalNumberOfPieces: number;
  onClose: () => void;
  sponsorImage?: string;
};

const useStyles = makeStyles((theme) => ({
  dialog: {
    textAlign: "center",
    padding: theme.spacing(2),
    display: "flex",
    alignItems: "center"
  },
  button: {
    width: "80%"
  },
  sponsoredByContainer: {
    height: "25px",
    width: "100%",
    display: "block",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    marginBottom: "16px"
  }
}));

export default function UploadSuccessDialog({
  totalNumberOfPieces,
  numberOfPiecesSubmitted,
  onClose,
  sponsorImage
}: Props) {
  const styles = useStyles();
  return (
    <Dialog open PaperProps={{ className: styles.dialog }}>
      <p>
        <p style={{ fontWeight: "bold" }}>Thank you.</p>
        <br />
        Your upload is now being moderated and will appear on the global map
        within 48 hours.
        <br />
        <br />
        We analyse all the data you collect to understand the trends and
        patterns of pollution to develop evidence-based solutions.
        <br />
        <br />
        Together we've recorded {totalNumberOfPieces} pieces of litter so far,
        and you just added {numberOfPiecesSubmitted}{" "}
        {numberOfPiecesSubmitted === 1 ? "piece" : "pieces"} to this!
        <br />
        <br />
        To see how many items you've contributed in total and your global
        position, open the leaderboard from the menu.
      </p>
      {sponsorImage && (
        <span
          className={styles.sponsoredByContainer}
          style={{ backgroundImage: "url(" + sponsorImage + ")" }}
        />
      )}
      <Button
        onClick={onClose}
        color="primary"
        variant="contained"
        className={styles.button}
      >
        OK
      </Button>
    </Dialog>
  );
}
