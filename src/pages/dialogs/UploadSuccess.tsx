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
    width: "80%",
    minHeight: "min-content"
  },
  sponsoredBy: {
    width: "100%",
    fontSize: "0.7rem",
    margin: 0,
    marginBottom: theme.spacing(0.5)
  },
  sponsorImage: {
    marginBottom: theme.spacing(2),
    height: "30px",
    width: "auto",
    alignSelf: "center"
  },
  bold: {
    fontWeight: "bold"
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
        <span className={styles.bold}>Thank you.</span>
        <br />
        <br />
        Your upload is in progress and once it has been moderated will appear on
        the global map within 48 hours.
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

      <p className={styles.sponsoredBy}>Sponsored by</p>
      <img
        className={styles.sponsorImage}
        src={sponsorImage}
        alt="sponsor logo"
      />

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
