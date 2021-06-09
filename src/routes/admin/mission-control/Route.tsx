import PageWrapper from "components/PageWrapper";
import MissionControlPage from "pages/admin/mission-control/MissionControl";
import { useHistory } from "react-router";

export default function MissionControlRoute() {
  const history = useHistory();
  return (
    <PageWrapper
      label="Mission Control"
      navigationHandler={{ handleBack: () => history.push("/") }}
    >
      <MissionControlPage />
    </PageWrapper>
  );
}
