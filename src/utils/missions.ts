import { Mission, missionHasEnded, missionHasStarted } from "../types/Missions";

export function sortMissions(missions: Mission[]) {
  return missions.sort((missionA: Mission, missionB: Mission) => {
    const missionAStarted = missionHasStarted(missionA);
    const missionAEnded = missionHasEnded(missionA);
    const missionBStarted = missionHasStarted(missionB);
    const missionBEnded = missionHasEnded(missionB);

    const missionAActive = missionAStarted && !missionAEnded;
    const missionBActive = missionBStarted && !missionBEnded;

    if (missionAActive && missionBActive) {
      return sortPrecedence(missionA, missionB, sortSmallestEndDate);
    }

    if (missionAActive !== missionBActive) {
      return missionAActive ? -1 : 1;
    }

    return -sortSmallestEndDate(missionA, missionB);
  });
}
type Sort = (missionA: Mission, missionB: Mission) => number;

function sortPrecedence(
  missionA: Mission,
  missionB: Mission,
  onEquality: Sort = () => 0
) {
  if (missionA.precedence === missionB.precedence) {
    return onEquality(missionA, missionB);
  }

  return missionA.precedence! > missionB.precedence! ? -1 : 1;
}

function sortSmallestEndDate(missionA: Mission, missionB: Mission) {
  if (missionA.endTime === missionB.endTime) {
    return 0;
  }

  return missionA.endTime < missionB.endTime ? -1 : 1;
}
