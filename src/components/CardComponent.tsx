import React from "react";

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import Photo from "types/Photo";
import PhotoFields from "./PhotoFields";

const useStyles = makeStyles((theme) => ({
  card: {
    width: "100%"
  }
}));

interface Props {
  photoSelected: Photo;
  handleReject: () => void;
  handleApprove: () => void;
}

const CardComponent = ({
  photoSelected,
  handleReject,
  handleApprove
}: Props) => {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <CardActionArea>
        <CardContent>
          <PhotoFields photo={photoSelected} />
        </CardContent>
      </CardActionArea>
      <CardActions>
        <IconButton
          aria-label="Reject"
          disabled={photoSelected.published === false}
          onClick={() => handleReject()}
        >
          <ThumbDownIcon />
        </IconButton>
        )
        <IconButton
          aria-label="Approve"
          disabled={!!photoSelected.published}
          onClick={() => handleApprove()}
        >
          <ThumbUpIcon />
        </IconButton>
        )
      </CardActions>
    </Card>
  );
};

export default CardComponent;
