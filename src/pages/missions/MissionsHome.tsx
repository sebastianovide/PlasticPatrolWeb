import { makeStyles } from "@material-ui/core/styles";
import Clear from "@material-ui/icons/Clear";
import Search from "@material-ui/icons/Search";
import PageWrapper from "components/PageWrapper";
import React, { useMemo, useState } from "react";
import "react-circular-progressbar/dist/styles.css";
import { useHistory } from "react-router";
import styles from "standard.module.scss";

import { linkToMap } from "../../custom/config";
import { useMissions } from "../../providers/MissionsProvider";
import { useUser } from "../../providers/UserProvider";
import { linkToCreateMission } from "../../routes/missions/links";
import {
  Mission,
  MissionFirestoreData,
  PRIVATE_MISSION_ID_SEARCH_LENGTH,
  userIsInMission
} from "../../types/Missions";
import User from "../../types/User";
import { sortMissions } from "../../utils/missions";
import MissionThumbnail from "./MissionThumbnail";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: "flex",
    flexFlow: "column",
    padding: "5%"
  },

  searchWrapper: {
    flex: "0 0 auto",
    background: styles.lightGrey,
    width: "100%",
    margin: "0 0 20px 0",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    padding: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
    boxSizing: "border-box",
    color: styles.darkgray,
    fontSize: 20
  },

  searchInput: {
    border: "none",
    background: styles.lightGrey,
    fontSize: 16,
    marginLeft: theme.spacing(1),
    boxSizing: "border-box",
    width: "100%",
    textOverflow: "ellipsis",
    "&:focus": {
      outline: "none"
    }
  },

  missionList: {
    flex: "0 0 auto"
  }
}));

type Props = {};

function getFilteredMissions(
  searchString: string,
  missions: MissionFirestoreData[],
  user?: User
): MissionFirestoreData[] {
  const missionNameIncludesSubstring = (name: string, substring: string) => {
    return name.toLowerCase().includes(substring.trim().toLowerCase());
  };

  const searchedPrivateMissionId = (mission: Mission, substring: string) => {
    return (
      mission.isPrivate &&
      substring.length >= PRIVATE_MISSION_ID_SEARCH_LENGTH &&
      mission.id.includes(substring.trim())
    );
  };

  return sortMissions(
    missions.filter((mission) => {
      // Convert to lower case and check for string includes.
      const missionNameIncludesSearchString = missionNameIncludesSubstring(
        mission.name,
        searchString
      );

      // Users can see private missions if they:
      // - explicitly search the private mission ID,
      // - they can already see the mission (they are in the mission or a moderator) and they the search string matches.
      if (mission.isPrivate) {
        const userCanAlreadySeePrivateMission =
          user !== undefined &&
          (user.isModerator || userIsInMission(user, mission.id));
        return (
          searchedPrivateMissionId(mission, searchString) ||
          (userCanAlreadySeePrivateMission && missionNameIncludesSearchString)
        );
      }

      // If it's a public mission, just compare string search.
      return missionNameIncludesSearchString;
    })
  );
}

export default function MissionsHome({}: Props) {
  const history = useHistory();
  const handleClose = () => history.push(linkToMap());

  const missionData = useMissions();
  const user = useUser();

  const classes = useStyles();
  const [searchString, setSearchString] = useState("");
  const filteredMissionList = useMemo(
    () => getFilteredMissions(searchString, missionData?.missions || [], user),
    [searchString, missionData]
  );

  return (
    <PageWrapper
      label={"Missions"}
      navigationHandler={{ handleClose: handleClose }}
      className={classes.wrapper}
      addAction={
        !user?.isModerator
          ? undefined
          : () => history.push(linkToCreateMission())
      }
    >
      <div className={classes.searchWrapper}>
        <Search style={{ color: styles.darkgrey }} />
        <input
          placeholder={"Search"}
          className={classes.searchInput}
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />
        {searchString.length > 0 && (
          <Clear
            style={{ color: styles.darkgrey }}
            onClick={() => setSearchString("")}
          />
        )}
      </div>

      <div className={classes.missionList}>
        {missionData?.missions === undefined ? (
          <div>Loading...</div>
        ) : filteredMissionList.length === 0 ? (
          <div>Missions coming soon</div>
        ) : (
          filteredMissionList.map((mission: MissionFirestoreData) => (
            <MissionThumbnail key={mission.id} mission={mission} />
          ))
        )}
      </div>
    </PageWrapper>
  );
}
