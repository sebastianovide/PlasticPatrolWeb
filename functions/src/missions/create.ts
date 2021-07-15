import * as functions from "firebase-functions";

import admin from "firebase-admin";

import { firestore } from "../firestore";
import { getDisplayName } from "../stats";
import { MissionFromServer, ConfigurableMissionData } from "./models";

type MissionToPersist = Omit<MissionFromServer, "id">;

export default functions.https.onCall(
  async (
    restOfMission: ConfigurableMissionData,
    callableContext
  ): Promise<MissionFromServer> => {
    const ownerUserId = callableContext.auth?.uid;
    if (!ownerUserId) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "User must be authenticated"
      );
    }
    const user = await admin.auth().getUser(ownerUserId);
    const displayName = getDisplayName(user);

    const missionToPersist: MissionToPersist = {
      ...restOfMission,
      ownerUserId,
      totalPieces: 0,
      totalUserPieces: {},
      pendingPieces: 0,
      pendingUsers: []
    };

    const { id } = await firestore.collection("missions").add(missionToPersist);

    return { id, ...missionToPersist };
  }
);
