import { matchPath } from "react-router";

import { linkToUploadSuccess } from "routes/upload-success/links";
import config from "custom/config";
import { linkToLogin } from "routes/login/links";

const VISIBILITY_REGEX = new RegExp(
  "(^/@|^/$|^" +
    config.PAGES.displayPhoto.path +
    "/|^" +
    config.PAGES.embeddable.path +
    ")",
  "g"
);

export default function getMapIsVisible(pathname: string) {
  const isOnUploadSuccessPath = matchPath(pathname, {
    path: linkToUploadSuccess(),
    exact: false
  });
  const isOnLogin = matchPath(pathname, {
    path: linkToLogin()
  });

  const matchesVisibilityRegex = pathname.match(VISIBILITY_REGEX);

  return isOnUploadSuccessPath || isOnLogin || matchesVisibilityRegex;
}
