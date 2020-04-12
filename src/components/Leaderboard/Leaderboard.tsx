import React from "react";
import classNames from "classnames";

import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";

import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import config from "custom/config";

import PageWrapper from "../PageWrapper";

import LeaderboardBody from "./LeaderboardBody";

const styles = (theme: any) => ({
  th: {
    fontWeight: "bold",
    color: theme.palette.common.white,
    backgroundColor: "rgba(0, 0, 0, 0.54)",
  },
  highlightRow: {
    fontWeight: "bold",
    color: config.THEME.palette.secondary.main,
  },
  cell: {
    position: "relative",
    padding: theme.spacing(1),
    fontSize: "inherit",
  },
  truncate: {
    position: "absolute",
    top: theme.spacing(1.5),
    maxWidth: "90%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
});

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
  config: any;
  classes: any;
  label: string;
  handleClose: () => void;
};

//@ts-ignore
export default withStyles(styles)(Leaderboard);

function Leaderboard({
  classes,
  label,
  handleClose,
  user,
  usersLeaderboard,
}: Props) {
  return (
    <PageWrapper label={label} handleClose={handleClose} hasLogo={false}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              className={classNames(classes.th, classes.cell)}
              style={{ width: "10%", textAlign: "center" }}
            >
              Rank
            </TableCell>
            <TableCell
              className={classNames(classes.th, classes.cell)}
              style={{ width: "60%" }}
            >
              User
            </TableCell>
            <TableCell
              className={classNames(classes.th, classes.cell)}
              style={{ width: "10%" }}
            >
              Pieces
            </TableCell>
          </TableRow>
        </TableHead>
        <LeaderboardBody
          usersLeaderboard={usersLeaderboard}
          classes={classes}
          user={user}
        />
      </Table>
    </PageWrapper>
  );
}
