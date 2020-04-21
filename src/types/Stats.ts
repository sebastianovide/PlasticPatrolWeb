type StatsUser = {
  displayName: string;
  pieces: number;
  uid: string;
  uploaded: number;
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

export default Stats;
