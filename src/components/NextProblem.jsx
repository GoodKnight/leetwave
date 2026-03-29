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
  const { nextProblem, timer, userProgress, delayProblem } = useApp();

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
          {problem.neetcodeVideo && (
            <a
              href={problem.neetcodeVideo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Watch NeetCode explanation
            </a>
          )}
          {isReview && progress?.notes && <RevealableNotes notes={progress.notes} />}
        </div>
        {!timer.isRunning && (
          <div className="flex flex-col gap-2">
            <button
              onClick={handleStart}
              className="px-5 py-2.5 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
            >
              Start
            </button>
            <button
              onClick={() => delayProblem(problem.id)}
              className="px-5 py-2 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Later
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
