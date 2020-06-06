export function linkToFeedbackReports() {
  return "/feedback-reports";
}

export function linkToFeedbackReport(feedbackId: string = ":feedbackId") {
  return `${linkToFeedbackReports()}/${feedbackId}`;
}
