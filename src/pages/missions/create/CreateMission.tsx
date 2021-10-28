import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import PageWrapper from "components/PageWrapper";
import "react-circular-progressbar/dist/styles.css";
import { useHistory } from "react-router";
import Button from "@material-ui/core/Button";
import MissionForm from "../common/MissionForm";
import {
  ConfigurableMissionData,
  EmptyMissionData,
  isMissionDataValid,
  isDuplicatingExistingMissionName
} from "../../../types/Missions";

import { linkToCreateMission } from "../../../routes/missions/links";
import { useUser } from "../../../providers/UserProvider";
import { createMission } from "../../../features/firebase/missions";
import { useMissions } from "../../../providers/MissionsProvider";
import { linkToLoginWithRedirectOnSuccess } from "../../../routes/login/links";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    padding: "5%",
    display: "flex",
    flexDirection: "column"
  },

  loginButton: {
    margin: `${theme.spacing(1)}px 0px`,
    color: `white`,
    backgroundColor: theme.palette.primary.main
  },

  missionFormWrapper: {
    flex: "1",
    clear: "both",
    overflow: "scroll"
  },

  submitButton: {
    marginTop: 5,
    width: "100%"
  },

  formErrorWarning: {
    color: "#f00",
    margin: "5px 0",
    flex: 0
  }
}));

type Props = {};

export default function CreateMission({}: Props) {
  const styles = useStyles();
  const { t } = useTranslation();
  const history = useHistory();
  const user = useUser();

  const handleBack = {
    handleBack: () => history.goBack(),
    confirm: user !== undefined
  };

  const missionData = useMissions();
  const missions = missionData?.missions || [];
  const [
    missionFormData,
    setMissionFormData
  ] = useState<ConfigurableMissionData>(EmptyMissionData);
  const [creatingMission, setCreatingMission] = useState(false);

  if (user === undefined) {
    return (
      <PageWrapper
        label={t("missions_create_button_text")}
        navigationHandler={handleBack}
        className={styles.wrapper}
      >
        {t("missions_login_warning")}
        <Button
          color="default"
          variant="contained"
          className={styles.loginButton}
          onClick={() =>
            history.push(
              linkToLoginWithRedirectOnSuccess(linkToCreateMission())
            )
          }
        >
          {t("login_button_text")}
        </Button>
      </PageWrapper>
    );
  }

  const duplicatingExistingMissionName = isDuplicatingExistingMissionName(
    missionFormData,
    missions
  );
  const missionReady =
    isMissionDataValid(missionFormData) && !duplicatingExistingMissionName;

  const createAndViewMission = async () => {
    setCreatingMission(true);
    await createMission(user, missionFormData);
    await missionData?.refresh();
    history.goBack();
  };

  return (
    <PageWrapper
      label={t("missions_create_label")}
      navigationHandler={handleBack}
      className={styles.wrapper}
    >
      <div className={styles.missionFormWrapper}>
        <MissionForm
          initialData={undefined}
          refreshCounter={0}
          onMissionDataUpdated={setMissionFormData}
        />
      </div>
      <div>
        <Button
          className={styles.submitButton}
          onClick={createAndViewMission}
          color="primary"
          variant="contained"
          disabled={!missionReady || creatingMission}
        >
          {t("missions_create_button_text")}
        </Button>
      </div>
      {duplicatingExistingMissionName && (
        <div className={styles.formErrorWarning}>
          {t("missions_duplicate_name_warning")}
        </div>
      )}
    </PageWrapper>
  );
}
