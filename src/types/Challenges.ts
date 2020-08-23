import {StatsUser} from "./Stats";

type Challenge = {
    id: number,
    name: string;
    description: string;
    picture: string;
    startTime: number;
    endTime: number;
    users: ChallengeUserData[];
    targetPieces: number;
    currentPieces: number;
};

type ChallengeUserData = {
    uid: string;
    displayName: string
    pieces: number;
    isModerator: boolean;
}

type NewChallengeRequest = {
    name: string;
    description: string;
    picture: string;
    startTime: number;
    endTime: number;
    users: ChallengeUserData[];
    targetPieces: number;
}

export default Challenge;
