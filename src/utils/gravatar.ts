import md5 from "md5";
import _ from "lodash";
import User from "types/User";

declare global {
    interface Window {
        userFromGravatar:any;
    }
}

export function addGravatarInfo(currentUser: User) {
  if (_.isEmpty(currentUser.email)) return;

  // this has to be global to be found by the jsonp
  window.userFromGravatar = (profile: any) => {
    const info = profile.entry[0];
    currentUser.description = info.aboutMe;
    currentUser.location = info.currentLocation;
    currentUser.profileURL = info.profileUrl;
    currentUser.displayName = info.name
      ? info.name.formatted
      : currentUser.displayName;
    currentUser.photoURL = _.isEmpty(currentUser.photoURL) ? "https://www.gravatar.com/avatar/" + md5(currentUser.email) : currentUser.photoURL;
  };

  // add a script node to the dom. The browser will run it but we don't know when.
  const gravatarURL =
    "https://www.gravatar.com/" + md5(currentUser.email) + ".json";
  const script = document.createElement("script");
  script.src = `${gravatarURL}?callback=userFromGravatar`;
  document.head.append(script);
}