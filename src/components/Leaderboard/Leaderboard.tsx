import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";

import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import PageWrapper from "../PageWrapper";

import LeaderboardBody from "./LeaderboardBody";
import { LeaderboardT, CurrentUser } from "./types";

type Props = {
  usersLeaderboard: LeaderboardT;
  user: CurrentUser;
  config: any;
  label: string;
  handleClose: () => void;
};

const useStyles = makeStyles(theme => ({
  header: {
    fontWeight: "bold",
    position: "relative",
    padding: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText
  }
}));

export default function Leaderboard({
  label,
  handleClose,
  user,
  usersLeaderboard
}: Props) {
  const classes = useStyles();
  return (
    <PageWrapper label={label} handleClose={handleClose} hasLogo={false}>
      <Table>
        <TableHead>
          <TableRow color="primary">
            <TableCell
              className={classes.header}
              style={{ width: "10%", textAlign: "center" }}
            >
              Rank
            </TableCell>
            <TableCell className={classes.header} style={{ width: "60%" }}>
              User
            </TableCell>
            <TableCell className={classes.header} style={{ width: "10%" }}>
              Pieces
            </TableCell>
          </TableRow>
        </TableHead>
        <LeaderboardBody usersLeaderboard={usersLeaderboard} user={user} />
      </Table>
    </PageWrapper>
  );
}
