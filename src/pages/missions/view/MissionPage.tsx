import { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import styles from "standard.module.scss";

import PageWrapper from "components/PageWrapper";
import "react-circular-progressbar/dist/styles.css";
import { useHistory, useParams } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { useTranslation, Trans } from "react-i18next";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
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
import WebAppMissionDialog from "./WebAppMissionDialog";
import MissionShareDialog from "./MissionShareDialog";
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
  },

  circularProgress: {
    position: "absolute",
    top: "40%",
    left: "40%"
  }
}));

export default function MissionPage() {
  const classes = useStyles();
  const themes = useTheme();
  const user = useUser();
  const { t } = useTranslation();

  const history = useHistory();
  const handleBack = () => history.push(linkToMissionsPage());

  const missionData = useMissions();
  const missions = missionData?.missions || [];

  const [showWebAppMissionModal, setShowWebAppMissionModal] = useState(true);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPostJoinModal, setShowPostJoinModal] = useState(false);

  const { missionId } = useParams<{ missionId: string }>();
  const mission = missions.find((ch) => ch.id.toString() === missionId);

  if (missionData?.missions === undefined) {
    return (
      <div className={classes.circularProgress}>
        <CircularProgress size={100} />
        <Snackbar open={true} message="Loading mission..." />
      </div>
    );
  }

  if (mission === undefined) {
    return <div>{t("missions_not_found")}</div>;
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

  let progressText = t("missions_progress_text", { pieceTotal });

  if (missionIsCompleted(mission)) {
    progressText = t("missions_completed_text", {
      totalPieces: mission.totalPieces,
      targetPieces: mission.targetPieces
    });

    if (!missionEnded) {
      progressText += t("missions_not_ended_text");
    }
  } else if (missionEnded) {
    progressText = t("missions_ended_text", { pieceTotal });
  }

  return (
    <PageWrapper
      label={mission.name}
      navigationHandler={{ handleBack }}
      className={classes.wrapper}
    >
      <div className={classes.pictureWrapper}>
        <img
          src={imgSrc}
          alt={t("missions_cover_alternate_text")}
          className={classes.picture}
        />
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
              {t("missions_join_login_hint")}
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
                {t("login_button_text")}
              </Button>
            </div>
          )}
          {userLoggedIn &&
            !userInMission &&
            !missionEnded &&
            (userIsPendingMember ? (
              <div className={classes.pendingRequestLabel}>
                {t("missions_join_is_pending")}
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
                    ? t("missions_rejoin_button_text")
                    : t("missions_join_button_text")}
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
                {t("missions_upload_pieces_button_text")}
              </Button>
            </div>
          )}

          {!missionEnded && (
            <div className={classes.missionButton}>
              <Button
                onClick={() => setShowShareModal(true)}
                color="primary"
                size="small"
                variant="contained"
              >
                {t("missions_share_link_button_text")}
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
                {t("missions_leave_mission_button_text")}
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
                  {t("missions_manage_members")}
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
                {t("missions_edit_details_button_text")}
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
                {t("missions_delete_mission_button_text")}
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
            {t("missions_view_private_leaderboard")}
          </div>
        )}
      </div>
      <MissionShareDialog
        open={showShareModal}
        onClose={() => setShowShareModal(false)}
        missionId={missionId}
        isPrivate={mission.isPrivate}
      />

      {/* Modal shown if the user opens a mission share link on the web */}
      <WebAppMissionDialog
        open={
          window.location.hash.includes("app_share") &&
          Capacitor.platform === "web" &&
          showWebAppMissionModal
        }
        onClose={() => setShowWebAppMissionModal(false)}
      />

      {/* Modal shown after the user joins a public mission */}
      <Dialog
        open={showPostJoinModal}
        onClose={() => setShowPostJoinModal(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <Trans i18nKey="missions_post_join_mission_dialog_text">
            <DialogContentText id="alert-dialog-description">
              {`You have successfully joined this mission!`}
            </DialogContentText>
            <DialogContentText>
              {`Now, when a photo you upload is approved, the pieces of litter will be added to the mission total (and other missions you are part of).`}
            </DialogContentText>
            <DialogContentText>
              {`This will continue until either the mission finishes, or you leave the mission.`}
            </DialogContentText>
          </Trans>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPostJoinModal(false)} color="default">
            {t("ok_button_text")}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmationModal
        isOpen={showLeaveModal}
        text={t("missions_leave_mission_dialog_text")}
        confirmText={t("missions_leave_mission_button_text")}
        handleConfirm={leaveMissionSubmit}
        handleCancel={() => setShowLeaveModal(false)}
      />
      <ConfirmationModal
        isOpen={showDeleteModal}
        text={t("missions_delete_mission_dialog_text")}
        confirmText={t("missions_delete_mission_button_text")}
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
  const { t } = useTranslation();
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
          {t("cancel_button_text")}
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
