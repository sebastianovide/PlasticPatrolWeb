export type LeaderboardUser = {
  uid: string;
  displayName: string;
  pieces: number;
};
export type LeaderboardT = Array<LeaderboardUser>;
export type CurrentUser = { id?: string };
