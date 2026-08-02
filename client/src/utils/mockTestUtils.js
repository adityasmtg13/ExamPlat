/**
 * Determines the display state of a mock test based on its schedule,
 * attempt usage, and availability.
 *
 * Returns one of:
 * - "Start"       → Exam is open and student has no previous attempts  → button "Start Test"
 * - "ReTest"      → Exam is open and student has previous attempts     → button "Take Re-Test"
 * - "NotYetOpen"  → Exam is scheduled and start time is in the future  → button "Not Yet Open"
 * - "Completed"   → Attempts exhausted OR end time has passed          → button "Exam Completed"
 * - "Unavailable" → Any other state (Draft, Closed, Archived)          → button "Unavailable"
 */
export const getTestDisplayState = (test) => {
  const now = new Date();
  const endAt = test.defaultEndAt ? new Date(test.defaultEndAt) : null;

  const attemptsUsed = test.attemptsUsed || 0;
  const maximumAttempts = test.maximumAttempts || test.defaultAttempts || 1;

  // Completed if all attempts are used up
  const attemptsExhausted = attemptsUsed >= maximumAttempts;

  // Completed if the scheduled end time has passed
  const endTimePassed = endAt && now > endAt;

  if (attemptsExhausted || endTimePassed) {
    return "Completed";
  }

  // Exam is currently open and can be attempted
  if (test.canAttempt) {
    return attemptsUsed > 0 ? "ReTest" : "Start";
  }

  // Scheduled for the future (start time not reached yet)
  if (test.status === "Scheduled") {
    return "NotYetOpen";
  }

  // Fallback (Draft, Closed, Archived, or Live but blocked for this student)
  return "Unavailable";
};

/**
 * Returns true if the test is currently available to attempt.
 */
export const isTestAvailable = (test) => {
  const state = getTestDisplayState(test);
  return state === "Start" || state === "ReTest";
};