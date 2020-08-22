import {StatsUser} from "./Stats";

type Challenge = {
    id: number,
    name: string;
    description: string;
    picture: string;
    startTime: number;
    endTime: number;
    users: StatsUser[];
    targetPieces: number;
    currentPieces: number;
};

export default Challenge;
