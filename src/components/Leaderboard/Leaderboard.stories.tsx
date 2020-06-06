import React from "react";

import Leaderboard from "./Leaderboard";

export default { title: "Leaderboard", component: Leaderboard };

const user = {
  id: "user-1"
};

const props = {
  usersLeaderboard: Array.from({ length: 200 }, (_: any, i: number) => ({
    uid: `user-${i}`,
    displayName: `User ${i}`,
    pieces: i
  })),
  user: user,
  config: {},
  handleClose: () => {},
  label: "my label"
};

export const defaultSelector = () => <Leaderboard {...props} />;

export const withZeros = () => (
  <Leaderboard
    {...{
      ...props,
      usersLeaderboard: [
        { uid: "Bob", displayName: "Bob", pieces: 10 },
        { uid: "Alice", displayName: "Alice", pieces: 0 }
      ]
    }}
  />
);
