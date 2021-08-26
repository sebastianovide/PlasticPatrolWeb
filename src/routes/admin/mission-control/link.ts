import linkToAdminPages from "../links";

export default function linkToMissionControl() {
  return `${linkToAdminPages()}/mission-control`;
}

export function linkToMissionAdmin(missionId = ":missionId") {
  return `${linkToMissionControl()}/${missionId}`;
}
