import Challenge from "../types/Challenges";
import exampleImage from "assets/images/example.jpeg";

const FakeChallenge: Challenge = {
    id: 123,
    name: "This is the CHALLENGE",
    description: "this is the description of the challenge omg I hate plastic",
    picture: exampleImage,
    startTime: 1,
    endTime: 4,
    users: [
        {displayName: "Ally", pieces: 100, uid: "Ally", uploaded: 1},
        {displayName: "Neil", pieces: 90, uid: "Neil", uploaded: 1},
        {displayName: "Tom",  pieces: 80, uid: "Tom", uploaded: 1},
        {displayName: "Liz",  pieces: 7, uid: "Liz", uploaded: 1},
    ],
    currentPieces: 4,
    targetPieces: 10,
};

export const useChallenges = (): Challenge[] => {
    // const [challenges, setChallenges] = useState<Challenge[]>([]);
    // useEffect(
    //    setChallenges(FakeChallenges)
    // );
    return [FakeChallenge, FakeChallenge, FakeChallenge, FakeChallenge, FakeChallenge, FakeChallenge];
};
