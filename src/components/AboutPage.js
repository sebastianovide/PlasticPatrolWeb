import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CachedIcon from "@material-ui/icons/Cached";
import { withStyles } from "@material-ui/core/styles";

import PageWrapper from "./PageWrapper";

const styles = (theme) => ({
  typography: {
    ...theme.mixins.gutters(),
    whiteSpace: "pre-wrap"
  }
});

class AboutPage extends React.Component {
  render() {
    const { classes, label, reloadPhotos, handleClose } = this.props;
    return (
      <PageWrapper
        label={label}
        navigationHandler={{ handleClose }}
        hasLogo={true}
      >
        <Typography
          align={"justify"}
          variant={"subtitle1"}
          className={classes.typography}
        >
          {"#PlasticPatrol is about engaging people with the issue of plastic pollution through adventure and nature, helping to safeguard our seas for the future.\n\n" +
            "Our mission is to combat the global plastic crisis by stopping the problem at its source – in our waterways.\n\n" +
            "Every single piece of plastic collected and shared on social media as part of the #PlasticPatrol movement is captured in our interactive map, creating a picture of the problem on a global scale for the very first time.\n\n" +
            "Using this app you can get involved. Simply take a photo of what you find by pressing the camera button and upload it directly to the map. After it has been approved you will be able to view the images by pressing the globe button."}
          <br />
          <span style={{ display: "block", textAlign: "center" }}>
            <Button
              onClick={reloadPhotos}
              color="primary"
              startIcon={<CachedIcon />}
            >
              Recache Photos
            </Button>
          </span>
          <br />
          Version {process.env.REACT_APP_VERSION}, build{" "}
          {process.env.REACT_APP_BUILD_NUMBER}
        </Typography>
      </PageWrapper>
    );
  }
}

export default withStyles(styles)(AboutPage);
