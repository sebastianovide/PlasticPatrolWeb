import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField
} from "@material-ui/core";
import { useMissions } from "providers/MissionsProvider";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Mission,
  missionHasEnded,
  missionHasStarted,
  missionIsCompleted
} from "types/Missions";

import {
  fetchAllMissions,
  setMissionPrecendence
} from "../../../features/firebase/missions";
import { sortMissions } from "../../../utils/missions";
import { filterMissions } from "./utils";

export default function MissionList({
  linkToMission
}: {
  linkToMission: (missionId: string) => string;
}) {
  const [searchString, setSearchString] = useState("");
  const [showActive, setShowActive] = useState(true);
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [showFinished, setShowFinished] = useState(true);

  const missionsContext = useMissions();
  const refreshMissions = async () => {
    setMissionsFromServer(await fetchAllMissions());
  };

  const [missionsFromServer, setMissionsFromServer] = useState<Mission[]>(
    missionsContext?.missions || []
  );

  useEffect(() => {
    if (missionsContext?.missions) {
      setMissionsFromServer(missionsContext.missions);
    }
  }, [missionsContext?.missions]);

  const missions = sortMissions(
    missionsFromServer.filter(
      filterMissions({
        idOrName: searchString,
        showActive,
        showUpcoming,
        showFinished
      })
    )
  );

  return (
    <Grid container spacing={1}>
      <Grid item xs={3}>
        <Grid container direction="column">
          <Grid item>
            <TextField
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
              label={"Mission name or id"}
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showActive}
                  onChange={(e) => setShowActive(e.target.checked)}
                />
              }
              label="Show active"
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showFinished}
                  onChange={(e) => setShowFinished(e.target.checked)}
                />
              }
              label="Show finished"
            />
          </Grid>
          <Grid>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showUpcoming}
                  onChange={(e) => setShowUpcoming(e.target.checked)}
                />
              }
              label="Show upcoming"
            />
          </Grid>
          <Grid>
            <Button
              onClick={refreshMissions}
              variant="contained"
              color="primary"
            >
              Refresh missions
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={9}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Reached goal</TableCell>
              <TableCell>Precedence</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {missions.map((mission) => (
              <MissionRow
                linkToMission={linkToMission}
                {...mission}
                key={mission.id}
              />
            ))}
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  );
}

function MissionRow({
  linkToMission,
  id,
  name,
  startTime,
  endTime,
  totalPieces,
  targetPieces,
  precedence: precedenceFromServer = 0
}: {
  linkToMission: (missionId: string) => string;
} & Mission) {
  const [precedence, setPrecedence] = useState(precedenceFromServer);

  const {
    submitting,
    setPrecedence: setPrecedenceOnServer
  } = usePrecedenceRequest();

  return (
    <TableRow>
      <TableCell>
        <Link key={id} to={linkToMission(id)}>
          {name}
        </Link>
      </TableCell>
      <TableCell>{getStatus({ endTime, startTime })}</TableCell>
      <TableCell>
        {String(missionIsCompleted({ totalPieces, targetPieces }))}
      </TableCell>
      <TableCell>
        {!missionHasEnded({ endTime }) && (
          <>
            <input
              value={precedence}
              onChange={(e) => setPrecedence(Number(e.target.value))}
              type="number"
              min={0}
            />
            {precedence !== precedenceFromServer && (
              <Button
                variant="contained"
                color="primary"
                disabled={submitting}
                onClick={() => setPrecedenceOnServer(id, precedence)}
              >
                submit
              </Button>
            )}
          </>
        )}
      </TableCell>
    </TableRow>
  );
}

function usePrecedenceRequest() {
  const [submitting, setSubmitting] = useState(false);

  const setPrecedence = async (missionId: string, precedence: number) => {
    setSubmitting(true);

    await setMissionPrecendence(missionId, precedence);

    setSubmitting(false);
  };

  return {
    submitting,
    setPrecedence
  };
}

function getStatus({
  startTime,
  endTime
}: {
  endTime: Mission["endTime"];
  startTime: Mission["startTime"];
}) {
  if (missionHasEnded({ endTime })) {
    return "Finished";
  }

  if (!missionHasStarted({ startTime })) {
    return "Upcoming";
  }

  return "Active";
}
