import { it } from "mocha";
import { strict as assert } from "assert";
import { computeStats } from "./utils";
import {
  QuerySnapshot,
  QueryDocumentSnapshot
} from "@firebase/firestore-types";
import { stubInterface } from "ts-sinon";
import { User, Photo, Group, RawUser } from "./types";

function makeQuerySnapshot<T>(id: string, data: T): QuerySnapshot<T> {
  const snapshot = stubInterface<QuerySnapshot<T>>();
  // @ts-ignore
  snapshot.forEach = f => [{ id, data: () => data }].forEach(f);
  return snapshot;
}

it("computesStats for users without groups", () => {
  const userId = "123";
  const groupId = "456";

  const rawUser: RawUser = {
    uid: userId,
    displayName: "Bob"
  };

  const user: User = {};

  const photo: Photo = {
    owner_id: userId,
    moderated: true,
    published: true,
    pieces: 10
  };

  const group: Group = {
    displayName: "My Group"
  };

  const stats = computeStats(
    [rawUser],
    makeQuerySnapshot<Group>(groupId, group),
    makeQuerySnapshot("photoId", photo),
    makeQuerySnapshot(userId, user)
  );
  assert.deepEqual(stats.totalUploaded, 1);
  assert.deepEqual(stats.moderated, 1);
  assert.deepEqual(stats.rejected, 0);
  assert.deepEqual(stats.published, 1);
  assert.deepEqual(stats.pieces, 10);
  assert.deepEqual(stats.users, [
    {
      uid: userId,
      displayName: "Bob",
      pieces: 10,
      uploaded: 1
    }
  ]);
  assert.deepEqual(stats.groups, [
    {
      gid: groupId,
      displayName: "My Group",
      pieces: 0,
      uploaded: 0
    }
  ]);
});

it("computesStats with groups", () => {
  const userId = "123";
  const groupId = "456";

  const rawUser: RawUser = {
    uid: userId,
    displayName: "Bob"
  };

  const user: User = {
    groups: [groupId]
  };

  const photo: Photo = {
    owner_id: userId,
    moderated: true,
    published: true,
    pieces: 10
  };

  const group: Group = {
    displayName: "My Group"
  };

  const stats = computeStats(
    [rawUser],
    makeQuerySnapshot<Group>(groupId, group),
    makeQuerySnapshot("photoId", photo),
    makeQuerySnapshot(userId, user)
  );

  assert.deepEqual(stats.totalUploaded, 1);
  assert.deepEqual(stats.moderated, 1);
  assert.deepEqual(stats.rejected, 0);
  assert.deepEqual(stats.published, 1);
  assert.deepEqual(stats.pieces, 10);
  assert.deepEqual(stats.users, [
    {
      uid: userId,
      displayName: "Bob",
      pieces: 10,
      uploaded: 1
    }
  ]);
  assert.deepEqual(stats.groups, [
    {
      gid: groupId,
      displayName: "My Group",
      pieces: 10,
      uploaded: 1
    }
  ]);
});
