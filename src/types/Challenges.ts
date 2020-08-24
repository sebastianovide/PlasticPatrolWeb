import {StatsUser} from "./Stats";

export type Challenge = {
    id: number,
    name: string;
    description: string;
    picture: string;
    startTime: number;
    endTime: number;
    currentPieces: number;
    targetPieces: number;
    users: ChallengeUserData[];
}

type ChallengeUserData = {
    uid: string;
    displayName: string
    pieces: number;
    isModerator: boolean;
}
