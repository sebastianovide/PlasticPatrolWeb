import React from "react";

import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import StarsIcon from "@material-ui/icons/Stars";
import { sortArrayByObjectKey } from "utils";

type LeaderboardUser = {
  uid: string;
  displayName: string;
  pieces: number;
};
type LeaderboardT = Array<LeaderboardUser>;
type CurrentUser = { id?: string };
type Props = {
  usersLeaderboard: LeaderboardT;
  user: CurrentUser;
  classes: any;
};

export default function LeaderboardBody({
  usersLeaderboard,
  classes,
  user,
}: Props) {
  const userId = user && user.id;
  sortArrayByObjectKey(usersLeaderboard, "pieces");

  return (
    <TableBody>
      {usersLeaderboard.map((user, index) => {
        const highlightRow = index === 0 || user.uid === userId;

        return (
          <TableRow key={index}>
            <TableCell className={classes.cell} style={{ textAlign: "center" }}>
              {index === 0 ? (
                <StarsIcon color="secondary" />
              ) : (
                <span className={`${highlightRow && classes.highlightRow}`}>
                  {index + 1}
                </span>
              )}
            </TableCell>
            <TableCell
              className={`${highlightRow && classes.highlightRow} ${
                classes.cell
              }`}
            >
              <div className={classes.truncate}>
                {/* TODO: leaderboard query to return only names (or obfuscated emails) */}
                {user.displayName.split("@")[0]}
              </div>
            </TableCell>
            <TableCell
              className={`${highlightRow && classes.highlightRow} ${
                classes.cell
              }`}
            >
              {user.pieces}
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
}
