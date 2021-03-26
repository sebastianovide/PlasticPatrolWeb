import User from "types/User";
import { remoteConfig } from "../features/firebase/firebaseInit";
// import { useUser } from "../providers/UserProvider";

// TODO: find a way to enabled them in iOS installed via testFlight and
// android installed via beta
export function isMissionEnabled(): boolean {
  // const user = useUser();
  return !!(
    remoteConfig.getBoolean("enable_missions") ||
    // user?.email.endsWith("@geovation.uk") ||
    // user?.email.endsWith("@plasticpatrol.co.uk") ||
    // user?.email.endsWith("sebastian.ovide@gmail.com") ||
    // user?.email.endsWith("munfro@gmail.com") ||
    localStorage.getItem("enable_missions") ||
    localStorage.getItem("debug")
  );
}

export function isMissionLaunchDay(): boolean {
  return remoteConfig.getBoolean("is_mission_launch_day");
}

/**
 * When a tester logs in, it will set the localstorage. Then the tester can log out and see the feature enabled even as an anonymous user
 * It is needed as it is not possible to know if the app has been installed via testflight or google beta.
 *
 * @param {User} user
 */
export function enableOrDisableFeatures(user: User) {
  if (user.isTester) {
    localStorage.setItem("enable_missions", "true");
  } else {
    localStorage.removeItem("enable_missions");
  }
}
