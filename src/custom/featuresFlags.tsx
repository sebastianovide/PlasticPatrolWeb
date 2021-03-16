// import User from "types/User";
import { remoteConfig } from "../features/firebase/firebaseInit";
// import { useUser } from "../providers/UserProvider";

// TODO: find a way to enabled them in iOS installed via testFlight and
// android installed via beta
export default function isMissionEnabled(): boolean {
    // const user = useUser();
    return  !!(
        remoteConfig.getBoolean("enable_missions") ||
        // user?.email.endsWith("@geovation.uk") ||
        // user?.email.endsWith("@plasticpatrol.co.uk") ||
        // user?.email.endsWith("sebastian.ovide@gmail.com") ||
        // user?.email.endsWith("munfro@gmail.com") ||
        localStorage.getItem("enable_missions") ||
        localStorage.getItem("debug")
    )
}