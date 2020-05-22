import _ from "lodash";
import {
  QuerySnapshot,
  QueryDocumentSnapshot
} from "@firebase/firestore-types";
import {
  RawUser,
  Group,
  User,
  Photo,
  Stats,
  UserStats,
  GroupStats,
  notEmpty
} from "./types";

export const computeStats = (
  rawUsers: RawUser[],
  groupsSnapshot: QuerySnapshot<Group>,
  photosSnapshot: QuerySnapshot<Photo>,
  usersSnapshot: QuerySnapshot<User>
): Stats => {
  const stats: Stats = {
    totalUploaded: 0,
    moderated: 0,
    published: 0,
    rejected: 0,
    pieces: 0,
    users: [],
    groups: []
  };

  const users: UserStats[] = rawUsers.map(user => {
    const userShort = {
      uid: user.uid,
      displayName: user.displayName || "",
      pieces: 0,
      uploaded: 0
    };
    return userShort;
  });

  const groups: GroupStats[] = [];
  groupsSnapshot.forEach((doc: QueryDocumentSnapshot<Group>) => {
    const { displayName } = doc.data();
    groups.push({
      gid: doc.id,
      displayName: displayName || "",
      pieces: 0,
      uploaded: 0
    });
  });

  // map from user -> the list of groups they are in
  const userToGroups: { [key: string]: GroupStats[] } = {};
  usersSnapshot.forEach((doc: QueryDocumentSnapshot<User>) => {
    // users can have a "groups" field with a list of group IDs.
    const userGroups = doc.data().groups;
    if (userGroups !== undefined) {
      // if the user has "groups", then find the group stats object corresponding
      // to that group and set the resulting list in userToGroups
      userToGroups[doc.id] = userGroups
        .map(groupId => groups.find(group => group.gid === groupId))
        .filter(notEmpty);
    }
  });

  // console.info(users);
  // console.info(users.find(user => !user.uid));

  photosSnapshot.forEach(doc => {
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

        const owner = users.find(user => user.uid === data.owner_id);

        // for each group that the owner is a member of, add the
        // # of pieces to that group's total count
        if (owner && owner.uid in userToGroups) {
          userToGroups[owner.uid].forEach(group => {
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

  stats.users = users.map(user => {
    // delete user.uid;
    return user;
  });

  stats.groups = groups;
  return stats;
};
