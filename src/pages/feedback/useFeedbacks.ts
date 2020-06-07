import { useState } from "react";

import User from "types/User";
import { Feedback } from "types/Feedback";

import useEffectOnMount from "hooks/useEffectOnMount";
import { dbFirebase } from "features/firebase";

export default function useFeedbacks(user: User) {
  const [feedbacks, setFeedbacks] = useState<Array<Feedback>>([]);

  useEffectOnMount(async () => {
    const feedbacks = await dbFirebase.fetchFeedbacks();
    setFeedbacks(feedbacks);
  });

  const handleToggleResolvedClick = async (feedback?: Feedback) => {
    if (feedback) {
      await dbFirebase.toggleUnreadFeedback(
        feedback.id,
        feedback.resolved,
        user.id
      );

      setFeedbacks((currentFeedbacks) => {
        const newFeedbacks = currentFeedbacks.map((f) => {
          if (f.id === feedback.id) {
            f.resolved = !f.resolved;
            return f;
          }

          return f;
        });
        return newFeedbacks;
      });
    }
  };

  const fetchFeedbackById = async (id: string) => {
    const newFeedback = await dbFirebase.getFeedbackByID(id);
    if (newFeedback) {
      setFeedbacks([...feedbacks, newFeedback]);
    }
  };

  return {
    feedbacks,
    handleToggleResolvedClick,
    fetchFeedbackById
  };
}
