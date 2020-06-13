import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  rockedRegular: {
    fontFamily: "rockedRegular",
    fontWeight: "lighter",
    "-webkit-font-smoothing": "antialiased"
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    position: "relative",
    color: "white"
  }
}));
