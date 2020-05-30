export function linkToUploadSuccess(number: string = ":number") {
  // `/` is needed so that embedabble path isn't added to slug
  return `/upload-success/${number}/`;
}
