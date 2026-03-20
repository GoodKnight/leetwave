import { useState } from 'react';
import { useApp } from '../context/AppContext';

const DIFFICULTY_COLORS = {
  Easy: 'text-green-500',
  Medium: 'text-yellow-500',
  Hard: 'text-red-500'
};

function RevealableNotes({ notes }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="mt-3">
      {revealed ? (
        <div className="p-3 bg-white dark:bg-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
          <span className="font-medium">Your notes:</span> {notes}
        </div>
      ) : (
        <button
          onClick={() => setRevealed(true)}
          className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          Show previous notes (spoiler)
        </button>
      )}
    </div>
  );
}

export default function NextProblem() {
  const { nextProblem, timer, userProgress } = useApp();

  if (!nextProblem) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-700 text-center">
        <h2 className="text-lg font-bold text-green-500">All caught up!</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          No problems to review and all problems solved.
        </p>
      </div>
    );
  }

  const { problem, isReview } = nextProblem;
  const progress = userProgress[problem.id];

  const handleStart = () => {
    window.open(problem.url, '_blank');
    timer.start(problem);
  };

  return (
    <div className={`rounded-xl p-6 mb-6 border ${
      isReview
        ? 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800'
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    }`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Next Problem
            </h2>
            {isReview && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400">
                Review
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold">
            <span className="text-gray-400">#{problem.leetcodeNumber}</span>{' '}
            {problem.title}
          </h3>
          <div className="flex items-center gap-3 mt-2">
            <span className={`text-sm font-medium ${DIFFICULTY_COLORS[problem.difficulty]}`}>
              {problem.difficulty}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{problem.topic}</span>
            {problem.sources.length >= 5 && (
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                {problem.sources.length} lists
              </span>
            )}
          </div>
          {isReview && progress?.notes && <RevealableNotes notes={progress.notes} />}
        </div>
        {!timer.isRunning && (
          <button
            onClick={handleStart}
            className="px-5 py-2.5 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
          >
            Start
          </button>
        )}
      </div>
    </div>
  );
}
