import React from "react";
import { useParams, useHistory } from "react-router-dom";

import UploadSuccessDialog from "pages/dialogs/UploadSuccess";
import { linkToNewPhoto } from "routes/photo/routes/new/links";

type Props = { sponsorImage?: string };

export default function UploadSuccessRoute({ sponsorImage }: Props) {
  const { isInMission } = useParams<{ isInMission: string }>();
  const history = useHistory();

  const navigateToHomeScreen = () => history.push("/");
  const navigateToAddPhoto = () => history.push(linkToNewPhoto());

  return (
    <UploadSuccessDialog
      onUploadAnotherPhoto={navigateToAddPhoto}
      onClose={navigateToHomeScreen}
      isInMission={JSON.parse(isInMission)}
      sponsorImage={sponsorImage}
    />
  );
}
