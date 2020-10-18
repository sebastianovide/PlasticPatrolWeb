import {linkToPhotoPage} from "../photo/links";

export function linkToChallengesPage() {
  return "/challenges";
}

export function linkToCreateChallenge() {
  return `${linkToChallengesPage()}/create`;
}

export function linkToSubmitChallengeDialog() {
  return `${linkToCreateChallenge()}/upload`;
}

export function linkToAddChallengeCoverPhotoDialog() {
  return `${linkToCreateChallenge()}/addphoto`;
}

export function linkToChallenge(challengeId: string = ":challengeId") {
  return `${linkToChallengesPage()}/${challengeId}`;
}

export function linkToApproveChallengers(challengeId: string = ":challengeId") {
  return `${linkToChallenge(challengeId)}/approve`;
}