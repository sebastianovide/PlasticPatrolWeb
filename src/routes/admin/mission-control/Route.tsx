import PageWrapper from "components/PageWrapper";
import { Redirect, Route, Switch, useHistory } from "react-router";
import { useParams } from "react-router-dom";

import MissionBreakdown from "../../../pages/admin/mission-control/MissionBreakdown";
import MissionList from "../../../pages/admin/mission-control/MissionList";
import linkToMissionControl, { linkToMissionAdmin } from "./link";

export default function MissionControlRoute() {
  const history = useHistory();
  return (
    <PageWrapper
      label="Mission Control"
      navigationHandler={{ handleBack: () => history.goBack() }}
    >
      <Switch>
        <Route path={linkToMissionControl()} exact>
          <MissionList linkToMission={linkToMissionAdmin} />
        </Route>
        <Route path={linkToMissionAdmin()}>
          <MissionBreakdownRoute />
        </Route>
        <Redirect to={linkToMissionControl()} />
      </Switch>
    </PageWrapper>
  );
}

function MissionBreakdownRoute() {
  const { missionId } = useParams<any>();

  return <MissionBreakdown missionId={missionId} />;
}
