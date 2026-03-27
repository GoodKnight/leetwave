import { useState } from 'react';
import { useApp } from '../context/AppContext';

const SOURCE_BADGES = {
  neetcode150: { label: 'NC', title: 'NeetCode 150', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' },
  blind75: { label: 'B75', title: 'Blind 75', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400' },
  grind75: { label: 'G75', title: 'Grind 75', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' },
  algomap: { label: 'AM', title: 'Algomap', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400' },
  seanprashad: { label: 'SP', title: "Sean Prashad's LeetCode Patterns", color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-400' },
  leetcode75: { label: 'LC75', title: 'LeetCode 75 Study Plan', color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400' },
  topinterview150: { label: 'TI', title: 'Top Interview 150', color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' }
};

const DIFFICULTY_COLORS = {
  Easy: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
  Hard: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
};

function StatusIcon({ status, onClick }) {
  if (status === 'solved') {
    return (
      <button
        onClick={onClick}
        title="Click to reset"
        className="w-5 h-5 rounded-full bg-green-500 inline-flex items-center justify-center flex-shrink-0 hover:bg-green-600 transition-colors cursor-pointer"
      >
        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </button>
    );
  }
  if (status === 'review') {
    return (
      <button
        onClick={onClick}
        title="Click to reset"
        className="w-5 h-5 rounded-full bg-yellow-500 inline-flex items-center justify-center flex-shrink-0 hover:bg-yellow-600 transition-colors cursor-pointer"
      >
        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" />
        </svg>
      </button>
    );
  }
  return (
    <span className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 inline-flex flex-shrink-0" />
  );
}

export default function ProblemRow({ problem }) {
  const { getStatus, timer, userProgress, resetProblem, updateNotes } = useApp();
  const status = getStatus(problem.id);
  const progress = userProgress[problem.id];
  const isHighPriority = problem.sources.length >= 5;
  const isTimerActive = timer.isRunning && timer.activeProblem?.id === problem.id;

  // Last attempt info
  const lastAttempt = progress?.confidenceHistory?.slice(-1)[0];
  const lastCompleted = lastAttempt?.date;
  const lastRating = lastAttempt?.rating;
  const nextReview = progress?.nextReviewDate;

  const handleStart = () => {
    window.open(problem.url, '_blank');
    timer.start(problem);
  };

  const handleReset = (e) => {
    e.stopPropagation();
    if (window.confirm(`Reset "${problem.title}" to unsolved? This removes all history for this problem.`)) {
      resetProblem(problem.id);
    }
  };

  const [showNotes, setShowNotes] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [draftNotes, setDraftNotes] = useState('');

  return (
    <div>
      <div className={`flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
        isTimerActive ? 'bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-indigo-300 dark:ring-indigo-700' : ''
      }`}>
        <StatusIcon status={status} onClick={status !== 'unsolved' ? handleReset : undefined} />

        {/* Problem Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <a
              href={problem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 truncate"
            >
              <span className="text-gray-400 dark:text-gray-500">#{problem.leetcodeNumber}</span>{' '}
              {problem.title}
            </a>
            {problem.isCustom && (
              <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400">
                Custom
              </span>
            )}
            {isHighPriority && (
              <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                HOT
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-1 mt-0.5">
            {problem.patterns.map(p => (
              <span key={p} className="text-[10px] text-gray-400 dark:text-gray-500">{p}</span>
            ))}
            {lastCompleted && (
              <>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-1">
                  &middot; solved {lastCompleted}
                </span>
                {lastRating && (
                  <span className={`text-[10px] font-medium ml-1 ${
                    lastRating === 'nailed_it' ? 'text-green-500' :
                    lastRating === 'got_there' ? 'text-yellow-500' :
                    'text-red-500'
                  }`}>
                    &middot; {lastRating === 'nailed_it' ? 'Nailed it' : lastRating === 'got_there' ? 'Got there' : 'Had to learn'}
                  </span>
                )}
                {nextReview && (
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-1">
                    &middot; review {nextReview}
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Difficulty Badge */}
        <span className={`flex-shrink-0 px-2 py-0.5 rounded text-xs font-medium ${DIFFICULTY_COLORS[problem.difficulty]}`}>
          {problem.difficulty}
        </span>

        {/* Source Badges — hidden on small screens */}
        <div className="hidden sm:flex flex-shrink-0 gap-1">
          {problem.sources.map(s => (
            <span key={s} title={SOURCE_BADGES[s]?.title} className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${SOURCE_BADGES[s]?.color}`}>
              {SOURCE_BADGES[s]?.label}
            </span>
          ))}
        </div>

        {/* NeetCode video */}
        {problem.neetcodeVideo && (
          <a
            href={problem.neetcodeVideo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 p-1 rounded text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title="Watch NeetCode explanation"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
        )}

        {/* Notes toggle — shown for all completed problems */}
        {status !== 'unsolved' && (
          <button
            onClick={() => {
              const opening = !showNotes;
              setShowNotes(opening);
              // If no notes yet, go straight to edit mode
              if (opening && !progress?.notes) {
                setDraftNotes('');
                setEditingNotes(true);
              }
            }}
            className={`flex-shrink-0 p-1 rounded transition-colors ${
              showNotes
                ? 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                : progress?.notes
                  ? 'text-indigo-400 dark:text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-300'
                  : 'text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400'
            }`}
            title={progress?.notes ? (showNotes ? 'Hide notes' : 'Show notes') : 'Add notes'}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        )}

        {/* Start Button */}
        {!timer.isRunning && (
          <button
            onClick={handleStart}
            className="flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            Start
          </button>
        )}
      </div>

      {/* Expandable notes */}
      {showNotes && (
        <div className="px-4 pb-3 pl-12">
          {editingNotes ? (
            <div className="space-y-2">
              <textarea
                value={draftNotes}
                onChange={e => setDraftNotes(e.target.value)}
                rows={3}
                placeholder="Key insight, pattern used, aha moment..."
                className="w-full text-sm px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    updateNotes(problem.id, draftNotes);
                    setEditingNotes(false);
                    if (!draftNotes) setShowNotes(false);
                  }}
                  className="px-3 py-1 rounded text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingNotes(false);
                    if (!progress?.notes) setShowNotes(false);
                  }}
                  className="px-3 py-1 rounded text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                {progress?.notes && (
                  <button
                    onClick={() => {
                      updateNotes(problem.id, '');
                      setEditingNotes(false);
                      setShowNotes(false);
                    }}
                    className="px-3 py-1 rounded text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ml-auto"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div
              onClick={() => { setDraftNotes(progress?.notes || ''); setEditingNotes(true); }}
              className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-md px-3 py-2 cursor-pointer hover:ring-1 hover:ring-indigo-300 dark:hover:ring-indigo-700 transition-all"
              title="Click to edit"
            >
              {progress?.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
