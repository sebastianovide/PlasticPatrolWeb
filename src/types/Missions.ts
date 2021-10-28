import { ImageMetaData } from "../pages/photo/state/types";
import User from "./User";
import i18n from "../custom/i18n";

export const PRIVATE_MISSION_ID_SEARCH_LENGTH = 6;

export type MissionId = string;

export type UserMissionData = {
  uid: string;
  pieces: number;
  displayName: string;
};
export type PendingUser = { uid: string; displayName: string; email: string };
export type TotalUserPieces = { [uid: string]: UserMissionData };
export type PendingUsers = Array<PendingUser>;

export type MissionFirestoreData = Omit<
  ConfigurableMissionData,
  "coverPhoto"
> & {
  id: string;
  ownerUserId: string;
  totalPieces: number;
  totalUserPieces: TotalUserPieces;
  pendingUsers: PendingUsers;
  hidden: boolean;
};

export type Mission = MissionFirestoreData & {
  coverPhotoUrl?: any;
};

export type ConfigurableMissionData = {
  name: string;
  description: string;
  isPrivate: boolean;
  startTime: number;
  endTime: number;
  targetPieces: number;
  coverPhoto?: ImageMetaData | string;
  precedence?: number;
};

export const coverPhotoIsMetaData = (
  str: ImageMetaData | string
): str is ImageMetaData => {
  return (str as ImageMetaData).imgSrc !== undefined;
};

export const equal = (
  mission: ConfigurableMissionData,
  other: ConfigurableMissionData
) => {
  return (
    mission.name === other.name &&
    mission.description === other.description &&
    mission.targetPieces === other.targetPieces &&
    mission.isPrivate === other.isPrivate &&
    isSameDay(new Date(mission.startTime), new Date(other.startTime)) &&
    isSameDay(new Date(mission.endTime), new Date(other.endTime))
  );
};

export const EmptyMissionData: ConfigurableMissionData = {
  name: "",
  description: "",
  isPrivate: false,
  startTime: 0,
  endTime: 0,
  targetPieces: 0,
  coverPhoto: undefined
};

export const missionHasEnded = (mission: {
  endTime: MissionFirestoreData["endTime"];
}): boolean => {
  const today: Date = new Date();
  today.setHours(0, 0, 0, 0);
  return mission.endTime < today.getTime();
};

export const missionHasStarted = (mission: {
  startTime: MissionFirestoreData["startTime"];
}): boolean => {
  const today: Date = new Date();
  today.setHours(0, 0, 0, 0);
  return mission.startTime < today.getTime();
};

export const missionIsCompleted = (mission: {
  totalPieces: MissionFirestoreData["totalPieces"];
  targetPieces: MissionFirestoreData["targetPieces"];
}): boolean => {
  return mission.totalPieces >= mission.targetPieces;
};

export const isSameDay = (date: Date, other: Date) => {
  return date.toDateString() === other.toDateString();
};

export function isDuplicatingExistingMissionName(
  missionConfigurableData: ConfigurableMissionData | undefined,
  existingMissions: MissionFirestoreData[],
  currentMissionId?: string
) {
  if (missionConfigurableData === undefined) {
    return false;
  }

  const existingMissionHasName = existingMissions.some(
    (existingMission: MissionFirestoreData) => {
      return (
        existingMission.name === missionConfigurableData.name &&
        existingMission.id !== currentMissionId
      );
    }
  );

  return existingMissionHasName;
}

export function isMissionDataValid(
  missionConfigurableData: ConfigurableMissionData | undefined
) {
  const today: Date = new Date();
  today.setHours(0, 0, 0, 0);
  return (
    missionConfigurableData !== undefined &&
    // Chehck mission has a name
    missionConfigurableData.name !== "" &&
    // Check mission has description
    missionConfigurableData.description !== "" &&
    // Has a valid number of pieces to collect
    missionConfigurableData.targetPieces > 0 &&
    // Has an end date set after the start date
    missionConfigurableData.endTime > missionConfigurableData.startTime
  );
}

export const userIsInMission = (user: User, missionId: MissionId): boolean => {
  return user.missions.includes(missionId);
};

export const userOnMissionLeaderboard = (
  mission: MissionFirestoreData,
  userId: string
): boolean => {
  return userId in mission.totalUserPieces;
};

export const userCollectedPiecesForMission = (
  mission: MissionFirestoreData,
  userId: string
): boolean => {
  return (
    userOnMissionLeaderboard(mission, userId) &&
    mission.totalUserPieces[userId].pieces > 0
  );
};

export const userIsInPendingMissionMembers = (
  mission: MissionFirestoreData,
  userId: string
): boolean => {
  return mission.pendingUsers.some((user) => user.uid === userId);
};

export const getDaysBetweenTimes = (
  startTimeMs: number,
  endTimeMs: number
): number => {
  return Math.floor((endTimeMs - startTimeMs) / (1000 * 60 * 60 * 24)) + 1;
};

export const getTextDurationBetweenTimes = (
  startTimeMs: number,
  endTimeMs: number
): string => {
  const daysRemaining = getDaysBetweenTimes(startTimeMs, endTimeMs);

  let duration;
  if (daysRemaining >= 31) {
    const months = Math.floor(daysRemaining / 31);
    duration = i18n.t("month_with_count", { count: Math.abs(months) });
  } else if (daysRemaining >= 7) {
    const weeks = Math.floor(daysRemaining / 7);
    const days = daysRemaining % 7;
    duration = `${i18n.t("week_with_count", { count: Math.abs(weeks) })}${days > 0 ? ` ${i18n.t("and_conjunction")} ${i18n.t("day_with_count", { count: Math.abs(days) })}` : ``}`;

  } else {
    duration = i18n.t("day_with_count", { count: Math.abs(daysRemaining) });
  }

  if (daysRemaining < 0) {
    return i18n.t("missions_finished_text", { duration });
  }

  return i18n.t("missions_remaining_count_text", { duration });
};
