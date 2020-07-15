export interface Photo {
  owner_id: string;
  moderated: boolean;
  published: boolean;
  pieces: number;
}

export interface Group {
  displayName: string;
}

export interface User {
  groups?: string[];
}

export interface BaseStats {
  // sum of the # of pieces in all uploads
  pieces: number;

  // both of these contain the # of uploads.
  // totalUploaded is needed here backwards compatibility but should
  // be considered deprecated
  totalUploaded: number;
  uploaded: number;

  // large uploads represent individual uploads (photos) with > 1000 pieces.
  // these are tracked here as a SUBSET of the above fields. so if a user
  // has 2 uploads, 1 with 2000 pieces and 1 with 1 pieces, the stats would look like:
  // {
  //   uploaded: 2,
  //   totalUploaded: 2,
  //   pieces: 2001,
  //   largeCollectionUploads: 1,
  //   largeCollectionPieces: 2000
  // }
  largeCollectionUploads: number;
  // sum of all pieces in large collections
  largeCollectionPieces: number;
}

export interface GroupStats extends BaseStats {
  gid: string;
  displayName: string;
}

export interface UserStats extends BaseStats {
  uid: string;
  displayName: string;
}

export interface Stats extends BaseStats {
  moderated: number;
  published: number;
  rejected: number;
  users: UserStats[];
  groups: GroupStats[];
}

export function notEmpty<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}
