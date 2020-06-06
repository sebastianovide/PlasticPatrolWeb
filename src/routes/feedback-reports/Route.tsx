import React from "react";
import { Route, useHistory } from "react-router";

import useFeedbacks from "pages/feedback/useFeedbacks";
import { FeedbackDetailsPage, FeedbackReportsPage } from "pages/feedback";
import { linkToFeedbackReport } from "./links";
import User from "types/User";

type Props = {
  user: User;
};
export default function FeedbackRoute({ user }: Props) {
  const history = useHistory();
  const handleClose = () => history.goBack();
  const {
    feedbacks,
    handleToggleResolvedClick,
    fetchFeedbackById
  } = useFeedbacks(user);

  return (
    <>
      <Route path={linkToFeedbackReport()}>
        <FeedbackDetailsPage
          feedbacks={feedbacks}
          handleToggleResolvedClick={handleToggleResolvedClick}
          handleClose={handleClose}
          fetchFeedbackById={fetchFeedbackById}
        />
      </Route>

      <FeedbackReportsPage
        feedbacks={feedbacks}
        handleClose={handleClose}
        handleToggleResolvedClick={handleToggleResolvedClick}
        handleFeedbackItemClick={(id: string) =>
          history.push(linkToFeedbackReport(id))
        }
      />
    </>
  );
}
