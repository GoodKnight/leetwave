import { addDays, formatDate } from './dateUtils';

const INTERVALS = {
  nailed_it:    [7, 14, 30, 90, 180],
  got_there:    [2, 5, 14, 30, 60],
  had_to_learn: [1, 3, 7, 14, 30]
};

const RATING_ORDER = { nailed_it: 2, got_there: 1, had_to_learn: 0 };

export function getNextReviewDate(confidenceRating, currentStage) {
  const schedule = INTERVALS[confidenceRating];
  const days = schedule[Math.min(currentStage, schedule.length - 1)];
  return formatDate(addDays(new Date(), days));
}

export function getAutoSuggestedConfidence(timeSpentSeconds, difficulty) {
  const minutes = timeSpentSeconds / 60;

  const benchmarks = {
    Easy:   { fast: 10, normal: 20 },
    Medium: { fast: 15, normal: 30 },
    Hard:   { fast: 20, normal: 40 }
  };

  const thresholds = benchmarks[difficulty] || benchmarks.Medium;

  if (minutes < thresholds.fast) return 'nailed_it';
  if (minutes < thresholds.normal) return 'got_there';
  return 'had_to_learn';
}

export function getNewReviewState(confidenceRating, previousState) {
  let newStage = 0;

  if (previousState && previousState.reviewStage !== undefined) {
    const prevRating = previousState.confidenceHistory?.slice(-1)[0]?.rating;

    if (prevRating && RATING_ORDER[confidenceRating] < RATING_ORDER[prevRating]) {
      // Confidence dropped — reset to stage 0
      newStage = 0;
    } else {
      // Confidence maintained or improved — advance
      newStage = previousState.reviewStage + 1;
    }
  }

  const schedule = INTERVALS[confidenceRating];
  const intervalDays = schedule[Math.min(newStage, schedule.length - 1)];

  return {
    nextReviewDate: getNextReviewDate(confidenceRating, newStage),
    currentInterval: intervalDays,
    reviewStage: newStage
  };
}
