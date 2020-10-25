import React from "react";
import {
  ApproveChallengers,
  ChallengePage,
  ChallengesHome,
  CreateChallenge
} from "pages/challenges";
import { Challenge } from "../../types/Challenges";
import {
  linkToApproveChallengers,
  linkToChallenge,
  linkToChallengesPage,
  linkToCreateChallenge
} from "./links";
import { Route, Switch } from "react-router-dom";
import { useHistory } from "react-router";

type Props = {
  user: { id?: string };
  challenges: Challenge[];
};

export default function ChallengesRoute({ user, challenges }: Props) {
  const history = useHistory();
  const handleClose = () => history.goBack();
  return (
    <Switch>
      <Route exact path={linkToChallengesPage()}>
        <ChallengesHome challenges={challenges} />
      </Route>

      <Route path={linkToCreateChallenge()}>
        <CreateChallenge />
      </Route>

      <Route path={linkToChallenge()}>
        <ChallengePage user={user} challenges={challenges} />
      </Route>

      <Route path={linkToApproveChallengers()}>
        <ApproveChallengers />
      </Route>
    </Switch>
  );
}
