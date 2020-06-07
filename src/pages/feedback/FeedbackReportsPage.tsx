import React, { useState } from "react";

import IconButton from "@material-ui/core/IconButton";
import Cross from "@material-ui/icons/Close";
import Done from "@material-ui/icons/DoneOutline";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles } from "@material-ui/core/styles";

import PageWrapper from "components/PageWrapper";

import { Feedback } from "types/Feedback";

const useStyles = makeStyles((theme) => ({
  checkbox: {
    marginTop: theme.spacing(1),
    marginLeft: 0
  },
  truncate: {
    maxWidth: "95%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  }
}));

type Props = {
  handleClose: () => void;
  feedbacks: Array<Feedback>;
  handleFeedbackItemClick: (id: string) => void;
  handleToggleResolvedClick: (feedback?: Feedback) => Promise<void>;
};

export default function FeedbackReportsPage({
  handleClose,
  feedbacks,
  handleFeedbackItemClick,
  handleToggleResolvedClick
}: Props) {
  const styles = useStyles();
  const [showAll, setShowAll] = useState(false);

  return (
    <PageWrapper label={"Feedback"} navigationHandler={{ handleClose }}>
      <div>
        <FormControlLabel
          className={styles.checkbox}
          checked={showAll}
          control={<Checkbox onChange={() => setShowAll(!showAll)} />}
          label="Show All"
        />

        <List dense={false}>
          {feedbacks
            .filter((feedback) => (showAll ? true : !feedback.resolved))
            // @ts-ignore
            .sort((a, b) => b.updated.toDate() - a.updated.toDate())
            .map((feedback) => (
              <div key={feedback.id}>
                <Divider />
                <ListItem
                  key={feedback.id}
                  button
                  onClick={() => handleFeedbackItemClick(feedback.id)}
                >
                  <ListItemText
                    disableTypography
                    primary={
                      <Typography
                        className={styles.truncate}
                        style={
                          feedback.resolved
                            ? { fontWeight: "normal" }
                            : { fontWeight: "bold" }
                        }
                      >
                        {feedback.feedback}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      aria-label="Resolved"
                      edge={false}
                      onClick={() => handleToggleResolvedClick(feedback)}
                    >
                      {feedback.resolved ? <Done /> : <Cross />}
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </div>
            ))}
          <Divider />
        </List>
      </div>
    </PageWrapper>
  );
}
