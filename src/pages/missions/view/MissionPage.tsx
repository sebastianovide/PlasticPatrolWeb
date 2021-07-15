import { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import styles from "standard.module.scss";

import PageWrapper from "components/PageWrapper";
import "react-circular-progressbar/dist/styles.css";
import { useHistory, useParams } from "react-router-dom";

import Button from "@material-ui/core/Button";
import { UserPieceRankTable } from "../../../components/Leaderboard";
import { Line } from "rc-progress";
import {
  linkToManagePendingMembers,
  linkToEditMission,
  linkToMissionsPage,
  linkToMission
} from "../../../routes/missions/links";
import { UserLeaderboardData } from "../../../components/Leaderboard/UserPieceRankTable";
import {
  joinMission,
  leaveMission,
  deleteMission
} from "../../../features/firebase/missions";
import { useMissions } from "../../../providers/MissionsProvider";
import { useUser } from "../../../providers/UserProvider";
import thumbnailBackup from "../../../assets/images/mission-thumbnail-backup.png";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText
} from "@material-ui/core";
import {
  missionHasEnded,
  userOnMissionLeaderboard,
  userIsInPendingMissionMembers,
  userIsInMission,
  missionIsCompleted,
  getTextDurationBetweenTimes
} from "../../../types/Missions";
import { linkToLoginWithRedirectOnSuccess } from "../../../routes/login/links";
import MissionShareDialog from "./MissionShareDialog";
import { isMissionLaunchDay } from "../../../custom/featuresFlags";
import { linkToNewPhoto } from "../../../routes/photo/routes/new/links";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: "flex",
    flexFlow: "column"
  },

  pictureWrapper: {
    flex: "0 0 auto",
    height: "180px",
    overflow: "hidden",
    textAlign: "center",
    marginBottom: `${theme.spacing(0.5)}px`
  },

  picture: {
    objectFit: "cover",
    width: "100%"
  },

  detailWrapper: {
    flex: "0 0 auto",
    display: "flex",
    flexDirection: "column"
  },

  datesLabel: {
    flex: "1 1 auto",
    fontWeight: `bold`,
    fontSize: 13,
    padding: `0px ${theme.spacing(1.5)}px`
  },

  description: {
    flex: "1 1 auto",
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    fontSize: 12
  },

  progressWrapper: {
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`
  },

  progressText: {
    color: "black",
    fontSize: 13,
    fontWeight: "bold",
    whiteSpace: "pre-wrap"
  },

  completedText: {
    color: "white",
    background: `${styles.green}`,
    padding: `5px`,
    borderRadius: "10px",
    fontSize: 13,
    whiteSpace: "pre-wrap",
    fontWeight: "bold"
  },

  buttonsWrapper: {
    marginLeft: `${theme.spacing(1)}px`,
    marginRight: `${theme.spacing(1)}px`,
    marginBottom: `${theme.spacing(1)}px`,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  },

  notLoggedInMessage: {
    color: `${theme.palette.primary.main}`,
    fontSize: "14px",
    padding: `0 ${theme.spacing(0.5)}px`
  },

  loginButton: {
    width: `100%`,
    color: `white`,
    marginTop: `5px`,
    backgroundColor: theme.palette.primary.main
  },

  missionButton: {
    margin: `${theme.spacing(0.2)}px ${theme.spacing(0.5)}px`
  },

  pendingRequestLabel: {
    fontSize: "14px"
  },

  tableWrapper: {
    flex: "1 1 auto"
  },

  hiddenTableLabel: {
    marginTop: "20px",
    padding: "20px",
    textAlign: "center",
    color: "grey"
  }
}));

export default function MissionPage() {
  const classes = useStyles();
  const themes = useTheme();
  const user = useUser();

  const history = useHistory();
  const handleBack = () => history.goBack();

  const missionData = useMissions();
  const missions = missionData?.missions || [];

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPostJoinModal, setShowPostJoinModal] = useState(false);

  const { missionId } = useParams<{ missionId: string }>();
  const mission = missions.find((ch) => ch.id.toString() === missionId);
  if (mission === undefined) {
    return <div>Could not find mission</div>;
  }

  const missionProgress = (mission.totalPieces / mission.targetPieces) * 100;

  const userId = user?.id || "-1";
  const userLoggedIn: boolean = user !== undefined;
  const userInMission: boolean =
    user !== undefined && userIsInMission(user, missionId);
  const userIsModerator: boolean = user?.isModerator || false;
  const userIsMissionOwner: boolean = user?.id === mission.ownerUserId;
  const userCanManageMission: boolean = userIsMissionOwner || userIsModerator;
  const userIsPendingMember: boolean = userIsInPendingMissionMembers(
    mission,
    userId
  );
  const missionEnded = missionHasEnded(mission);

  const usersLeaderboard: UserLeaderboardData[] = Object.values(
    mission.totalUserPieces || []
  );

  const imgSrc = mission.coverPhotoUrl || thumbnailBackup;

  const leaveMissionSubmit = async () => {
    await leaveMission(missionId, user);
    await missionData?.refresh();
    history.push(linkToMissionsPage());
  };

  const deleteMissionSubmit = async () => {
    await deleteMission(missionId);
    await missionData?.refresh();
    history.push(linkToMissionsPage());
  };

  const pieceTotal = `${mission.totalPieces}/${mission.targetPieces}`;

  let progressText = `${pieceTotal} pieces of litter collected so far!`;

  if (missionIsCompleted(mission)) {
    progressText = `Awesome!\nThis mission has ${mission.totalPieces} total pieces (original goal was ${mission.targetPieces}).`;
    if (!missionEnded) {
      progressText += `\n\nAdditional pieces can still be added until the mission duration has ended.`;
    }
  } else if (missionEnded) {
    progressText = `This mission has finished!\n${pieceTotal} pieces of litter were collected!`;
  }

  return (
    <PageWrapper
      label={mission.name}
      navigationHandler={{ handleBack }}
      className={classes.wrapper}
    >
      <div className={classes.pictureWrapper}>
        <img src={imgSrc} alt={"Mission cover"} className={classes.picture} />
      </div>
      <div className={classes.progressWrapper}>
        <div
          className={
            missionIsCompleted(mission)
              ? classes.completedText
              : classes.progressText
          }
        >
          {progressText}
        </div>
        {!missionIsCompleted(mission) && (
          <Line
            percent={missionProgress}
            strokeWidth={2}
            trailWidth={2}
            strokeColor={themes.palette.secondary.main}
            style={{ maxHeight: "10px" }}
          />
        )}
      </div>
      <div className={classes.detailWrapper}>
        <div className={classes.datesLabel}>
          {getTextDurationBetweenTimes(Date.now(), mission.endTime)} (end date:{" "}
          {new Date(mission.endTime).toLocaleDateString()})
        </div>
        <div className={classes.description}>{mission.description}</div>
        <div className={classes.buttonsWrapper}>
          {!userLoggedIn && !missionEnded && (
            <div className={classes.notLoggedInMessage}>
              Before you can join a mission, you need to login or register.
              <Button
                color="default"
                variant="contained"
                className={classes.loginButton}
                onClick={() =>
                  history.push(
                    linkToLoginWithRedirectOnSuccess(linkToMission(missionId))
                  )
                }
              >
                Login
              </Button>
            </div>
          )}
          {userLoggedIn &&
            !userInMission &&
            !missionEnded &&
            (userIsPendingMember ? (
              <div className={classes.pendingRequestLabel}>
                Your request to join this mission needs to be approved by a
                moderator or mission owner.
              </div>
            ) : (
              <div className={classes.missionButton}>
                <Button
                  onClick={async () => {
                    await joinMission(mission.id, user);
                    await missionData?.refresh();
                    setShowPostJoinModal(true);
                  }}
                  color="primary"
                  size="small"
                  variant="contained"
                >
                  {userOnMissionLeaderboard(mission, userId)
                    ? `REJOIN MISSION`
                    : `JOIN MISSION`}
                </Button>
              </div>
            ))}
          {userLoggedIn && userInMission && !missionEnded && (
            <div className={classes.missionButton}>
              <Button
                onClick={() => history.push(linkToNewPhoto())}
                color="primary"
                size="small"
                variant="contained"
              >
                Upload pieces
              </Button>
            </div>
          )}
          {!isMissionLaunchDay() &&
            userLoggedIn &&
            userInMission &&
            !missionEnded && (
              <div className={classes.missionButton}>
                <Button
                  onClick={() => setShowShareModal(true)}
                  color="primary"
                  size="small"
                  variant="contained"
                >
                  Share link
                </Button>
              </div>
            )}
          {userLoggedIn && userInMission && !missionEnded && (
            <div className={classes.missionButton}>
              <Button
                onClick={() => setShowLeaveModal(true)}
                color="secondary"
                size="small"
                variant="outlined"
              >
                Leave mission
              </Button>
            </div>
          )}
        </div>
        <div className={classes.buttonsWrapper}>
          {userLoggedIn &&
            userCanManageMission &&
            mission.pendingUsers.length > 0 &&
            !missionEnded && (
              <div className={classes.missionButton}>
                <Button
                  onClick={() => {
                    history.push(linkToManagePendingMembers(missionId));
                  }}
                  color="primary"
                  size="small"
                  variant="contained"
                >
                  Manage members
                </Button>
              </div>
            )}
          {userCanManageMission && !missionEnded && (
            <div className={classes.missionButton}>
              <Button
                onClick={() => {
                  history.push(linkToEditMission(missionId));
                }}
                color="primary"
                size="small"
                variant="contained"
              >
                Edit details
              </Button>
            </div>
          )}
          {userLoggedIn && !missionEnded && userCanManageMission && (
            <div className={classes.missionButton}>
              <Button
                onClick={() => setShowDeleteModal(true)}
                color="secondary"
                size="small"
                variant="outlined"
              >
                Delete mission
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className={classes.tableWrapper}>
        {!mission.isPrivate ||
        (user && userOnMissionLeaderboard(mission, user.id)) ||
        user?.isModerator ? (
          <UserPieceRankTable
            usersLeaderboard={usersLeaderboard}
            user={user}
            allowZeroPieces={true}
          />
        ) : (
          <div className={classes.hiddenTableLabel}>
            You need to join and be accepted into the mission to view the
            leaderboard.
          </div>
        )}
      </div>
      <MissionShareDialog
        open={showShareModal}
        onClose={() => setShowShareModal(false)}
        missionId={missionId}
        isPrivate={mission.isPrivate}
      />

      {/* Modal shown after the user joins a public mission */}
      <Dialog
        open={showPostJoinModal}
        onClose={() => setShowPostJoinModal(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`You have successfully joined this mission!`}
          </DialogContentText>
          <DialogContentText>
            {`Now, when a photo you upload is approved, the pieces of litter will be added to the mission total (and other missions you are part of).`}
          </DialogContentText>
          <DialogContentText>
            {`This will continue until either the mission finishes, or you leave the mission.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPostJoinModal(false)} color="default">
            Ok
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmationModal
        isOpen={showLeaveModal}
        text={
          "Are you sure you want to leave this mission? " +
          "You're pieces collected will remain in the leaderboard, but none of your new uploads will contribute to this mission. " +
          "If it's a public mission, you can rejoin at any time. " +
          "If it's a private mission, you'll need to request to rejoin."
        }
        confirmText={"Leave Mission"}
        handleConfirm={leaveMissionSubmit}
        handleCancel={() => setShowLeaveModal(false)}
      />
      <ConfirmationModal
        isOpen={showDeleteModal}
        text={
          "Are you sure you want to delete this mission? You'll need to ask Planet Patrol staff to retrieve it."
        }
        confirmText={"Delete Mission"}
        handleConfirm={deleteMissionSubmit}
        handleCancel={() => setShowDeleteModal(false)}
      />
    </PageWrapper>
  );
}

type ConfirmationModalProps = {
  isOpen: boolean;
  text: string;
  confirmText: string;
  handleConfirm: () => void;
  handleCancel: () => void;
};

const ConfirmationModal = ({
  isOpen,
  text,
  confirmText,
  handleConfirm,
  handleCancel
}: ConfirmationModalProps) => {
  return (
    <Dialog
      open={isOpen}
      onClose={() => handleCancel()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={(e) => {
            handleCancel();
          }}
          color="default"
        >
          Cancel
        </Button>
        <Button
          onClick={(e) => {
            handleConfirm();
          }}
          color="secondary"
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
