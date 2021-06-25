import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core";

type Props = {
  isInMission: boolean;
  onUploadAnotherPhoto: () => void;
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
  isInMission,
  onUploadAnotherPhoto,
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
        Your photo is now being moderated and will appear on the global map
        within 48 hours 🙌
        {isInMission && (
          <>
            <br />
            <br />
            The pieces you've uploaded have been added to the Mission(s) you are
            part of 🚀
          </>
        )}
      </p>

      {sponsorImage && (
        <>
          <p className={styles.sponsoredBy}>Sponsored by</p>
          <img
            className={styles.sponsorImage}
            src={sponsorImage}
            alt="sponsor logo"
          />
        </>
      )}

      <Button
        onClick={onUploadAnotherPhoto}
        color="primary"
        variant="contained"
        className={styles.button}
      >
        Upload another photo
      </Button>

      <br />

      <Button
        onClick={onClose}
        color="primary"
        variant="outlined"
        className={styles.button}
      >
        Back to the map
      </Button>
    </Dialog>
  );
}
