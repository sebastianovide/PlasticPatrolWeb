import _ from "lodash";
import admin from "firebase-admin";
import { QuerySnapshot, QueryDocumentSnapshot } from "@google-cloud/firestore";
import { Stats, UserStats, GroupStats, notEmpty } from "./types";
import { firestore, auth } from "./firestore";

/**
 * compute the stats from the given data about users, groups and photos
 */
export const computeStats = (
  rawUsers: admin.auth.UserRecord[],
  groupsSnapshot: QuerySnapshot,
  photosSnapshot: QuerySnapshot,
  usersSnapshot: QuerySnapshot
): Stats => {
  const users: UserStats[] = rawUsers.map((user) => {
    const userShort = {
      uid: user.uid,
      displayName: user.displayName || "",
      pieces: 0,
      uploaded: 0
    };
    return userShort;
  });

  const groups: GroupStats[] = [];
  groupsSnapshot.forEach((doc: QueryDocumentSnapshot) => {
    const { displayName } = doc.data();
    groups.push({
      gid: doc.id,
      displayName: displayName || "",
      pieces: 0,
      uploaded: 0
    });
  });

  const stats: Stats = {
    totalUploaded: 0,
    moderated: 0,
    published: 0,
    rejected: 0,
    pieces: 0,
    users,
    groups
  };

  // map from user -> the list of groups they are in
  const userToGroups: { [key: string]: GroupStats[] } = {};
  usersSnapshot.forEach((doc: QueryDocumentSnapshot) => {
    // users can have a "groups" field with a list of group IDs.
    const userGroups = doc.data().groups;
    if (userGroups !== undefined) {
      // if the user has "groups", then find the group stats object corresponding
      // to that group and set the resulting list in userToGroups
      userToGroups[doc.id] = userGroups
        .map((groupId: string) => groups.find((group) => group.gid === groupId))
        .filter(notEmpty);
    }
  });

  // console.info(users);
  // console.info(users.find(user => !user.uid));

  photosSnapshot.forEach((doc) => {
    // console.info(users.find(user => !user.uid));

    const data = doc.data();
    // console.info(data);

    stats.totalUploaded++;

    // has the upload been reviewed by a moderator ?
    if (data.moderated) {
      stats.moderated++;

      // has it been approved ?
      if (data.published) {
        stats.published++;

        const pieces = Number(data.pieces);
        if (pieces > 0) stats.pieces += pieces;
        // console.info(data.owner_id);
        // console.info(users.find(user => !user.uid));

        const owner = users.find((user) => user.uid === data.owner_id);

        // for each group that the owner is a member of, add the
        // # of pieces to that group's total count
        if (owner && owner.uid in userToGroups) {
          userToGroups[owner.uid].forEach((group) => {
            group.uploaded++;
            group.pieces += pieces;
          });
        }

        // console.info(owner);

        if (owner) {
          // console.info("found: ", owner);
          if (pieces > 0) owner.pieces += pieces;
          owner.uploaded++;
          owner.displayName = owner.displayName || "";

          // console.info(owner);
        } else {
          // console.info(`No user with id = '${data.owner_id}'`);
        }
      } else {
        stats.rejected++;
      }
    }
  });
  return stats;
};

/**
 * fetch all the users from the authentication database (not from our "users" collection")
 */
async function fetchUsers(): Promise<admin.auth.UserRecord[]> {
  // get all the users
  let users: admin.auth.UserRecord[] = [];
  let pageToken = undefined;
  do {
    /* eslint-disable no-await-in-loop */
    const listUsersResult: admin.auth.ListUsersResult = await auth.listUsers(
      1000,
      pageToken
    );
    pageToken = listUsersResult.pageToken;
    if (listUsersResult.users) {
      users = users.concat(listUsersResult.users);
    }
  } while (pageToken);
  return users;
}

/**
 * computes and returns the current stats but doesn't save them to the DB
 */
export const computeStatsAdHoc = async () => {
  const [rawUsers, groupDocuments, photos, users] = await Promise.all([
    fetchUsers(),
    firestore.collection("groups").get(),
    firestore.collection("photos").get(),
    firestore.collection("users").get()
  ]);
  return computeStats(rawUsers, groupDocuments, photos, users);
};

/**
 * recalculate the stats and save them in the DB
 *
 * @type {CloudFunction<Message>}
 */
export const updateStats = async () => {
  const stats = await computeStatsAdHoc();
  const statsWithTimestamp = {
    updated: admin.firestore.FieldValue.serverTimestamp(),
    ...stats
  };
  return await firestore.collection("sys").doc("stats").set(statsWithTimestamp);
};
