export type StatsUser = {
  displayName: string;
  pieces: number;
  uid: string;
  uploaded: number;
  largeCollectionUploads?: number;
  largeCollectionPieces?: number;
};

type Stats = {
  moderated: number;
  pieces: number;
  published: number;
  rejected: number;
  totalUploaded: number;
  updated: Date;
  users: StatsUser[];
};

export const EMPTY_STATS = {
  moderated: 0,
  pieces: 0,
  published: 0,
  rejected: 0,
  totalUploaded: 0,
  updated: new Date(),
  users: []
};

export default Stats;
