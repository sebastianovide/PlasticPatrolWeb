import React from "react";

import PageWrapper from "../PageWrapper";
import { StatsUser } from "types/Stats";
import { UserPieceRankTable } from "./index";
import { useTranslation } from "react-i18next";

type Props = {
  usersLeaderboard: StatsUser[];
  user: { id?: string };
  handleClose: () => void;
  label: string;
};

export default function Leaderboard({
  user,
  usersLeaderboard,
  handleClose,
  label
}: Props) {
  const { t } = useTranslation();
  return (
    <PageWrapper navigationHandler={{ handleClose }} label={t(label)}>
      <UserPieceRankTable
        usersLeaderboard={usersLeaderboard}
        user={user}
        allowZeroPieces={true}
      />
    </PageWrapper>
  );
}
