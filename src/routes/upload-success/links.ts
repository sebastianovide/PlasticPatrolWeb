export function linkToUploadSuccess(
  isInMission: boolean | string = ":isInMission"
) {
  // `/` is needed so that embedabble path isn't added to slug
  return `/upload-success/${isInMission}`;
}
