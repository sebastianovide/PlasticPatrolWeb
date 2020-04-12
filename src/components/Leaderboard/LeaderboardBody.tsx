import React from "react";
import classNames from "classnames";

import { makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import StarsIcon from "@material-ui/icons/Stars";
import { sortArrayByObjectKey } from "utils";

import { LeaderboardT, CurrentUser } from "./types";

type Props = {
  usersLeaderboard: LeaderboardT;
  user: CurrentUser;
};

const useStyles = makeStyles((theme) => ({
  highlightRow: {
    fontWeight: "bold",
    color: theme.palette.primary.main
  },
  truncate: {
    position: "absolute",
    top: theme.spacing(1.5),
    maxWidth: "90%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  cell: {
    position: "relative",
    padding: theme.spacing(1),
    fontSize: "inherit"
  }
}));

export default function LeaderboardBody({ usersLeaderboard, user }: Props) {
  const userId = user && user.id;
  sortArrayByObjectKey(usersLeaderboard, "pieces").reverse();

  const classes = useStyles();
  return (
    <TableBody>
      {usersLeaderboard.map((user, index) => {
        const highlightRow = index === 0 || user.uid === userId;

        return (
          <TableRow key={index}>
            <TableCell className={classes.cell} style={{ textAlign: "center" }}>
              {index === 0 ? (
                <StarsIcon color="primary" />
              ) : (
                <span
                  className={classNames({
                    [classes.highlightRow]: highlightRow
                  })}
                >
                  {index + 1}
                </span>
              )}
            </TableCell>
            <TableCell
              className={classNames(classes.cell, {
                [classes.highlightRow]: highlightRow
              })}
            >
              <div className={classes.truncate}>
                {/* TODO: leaderboard query to return only names (or obfuscated emails) */}
                {user.displayName.split("@")[0]}
              </div>
            </TableCell>
            <TableCell
              className={classNames(classes.cell, {
                [classes.highlightRow]: highlightRow
              })}
            >
              {user.pieces}
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
}
