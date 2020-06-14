import React from "react";
import AccountPage from "pages/account";

import User from "types/User";
import Feature from "types/Feature";
import Geojson from "types/Geojson";

import { Config } from "custom/config";

type Props = {
  user: User;
  geojson: Geojson;
  handlePhotoClick: (feature: Feature) => void;
  handleClose: () => void;
  config: Config;
};

export default function AccountPageRoute(props: Props) {
  return <AccountPage {...props} />;
}
