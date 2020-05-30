import React from "react";
import { useParams, useHistory } from "react-router-dom";

import UploadSuccessDialog from "pages/dialogs/UploadSuccess";

type Props = { totalNumberOfPieces: number };

export default function UploadSuccessRoute({ totalNumberOfPieces }: Props) {
  const { number } = useParams();
  const history = useHistory();

  const navigateToHomeScreen = () => history.push("/");

  return (
    <UploadSuccessDialog
      numberOfPiecesSubmitted={Number(number)}
      totalNumberOfPieces={totalNumberOfPieces}
      onClose={navigateToHomeScreen}
    />
  );
}
