import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getAutoSuggestedConfidence } from '../utils/spacedRepetition';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

const RATINGS = [
  { key: 'nailed_it', label: 'Nailed it', color: 'green', desc: 'Solved cleanly, understood pattern' },
  { key: 'got_there', label: 'Got there', color: 'yellow', desc: 'Needed hints or took a while' },
  { key: 'had_to_learn', label: 'Had to learn', color: 'red', desc: "Couldn't solve, studied solution" }
];

const COLOR_CLASSES = {
  green: {
    selected: 'bg-green-600 text-white ring-2 ring-green-400',
    unselected: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50',
    suggested: 'ring-2 ring-green-400 ring-offset-2 dark:ring-offset-gray-800'
  },
  yellow: {
    selected: 'bg-yellow-500 text-white ring-2 ring-yellow-400',
    unselected: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50',
    suggested: 'ring-2 ring-yellow-400 ring-offset-2 dark:ring-offset-gray-800'
  },
  red: {
    selected: 'bg-red-600 text-white ring-2 ring-red-400',
    unselected: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50',
    suggested: 'ring-2 ring-red-400 ring-offset-2 dark:ring-offset-gray-800'
  }
};

export default function CompletionModal() {
  const { timer, completeProblem, setShowCompletionModal, userProgress } = useApp();
  const problem = timer.activeProblem;

  const autoSuggested = getAutoSuggestedConfidence(timer.elapsedSeconds, problem.difficulty);

  const [timeMinutes, setTimeMinutes] = useState(Math.floor(timer.elapsedSeconds / 60));
  const [timeSeconds, setTimeSeconds] = useState(timer.elapsedSeconds % 60);
  const [selectedRating, setSelectedRating] = useState(autoSuggested);
  const [notes, setNotes] = useState(userProgress[problem.id]?.notes || '');

  const timeEdited = (timeMinutes * 60 + timeSeconds) !== timer.elapsedSeconds;
  const effectiveTime = timeMinutes * 60 + timeSeconds;

  const handleSubmit = () => {
    completeProblem(problem.id, {
      rating: selectedRating,
      timeSpent: effectiveTime,
      timeEdited,
      notes,
      gaveUp: false,
      autoSuggested
    });
    timer.reset();
    setShowCompletionModal(false);
  };

  const handleCancel = () => {
    timer.reset();
    setShowCompletionModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
        <h2 className="text-lg font-bold mb-1">Problem Complete</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          #{problem.leetcodeNumber} {problem.title}
        </p>

        {/* Editable Time */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Time Spent</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              value={timeMinutes}
              onChange={e => setTimeMinutes(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-20 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-center"
            />
            <span className="text-sm text-gray-500">min</span>
            <input
              type="number"
              min="0"
              max="59"
              value={timeSeconds}
              onChange={e => setTimeSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
              className="w-20 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-center"
            />
            <span className="text-sm text-gray-500">sec</span>
          </div>
          {timeEdited && (
            <p className="text-xs text-gray-400 mt-1">Adjusted from {formatTime(timer.elapsedSeconds)}</p>
          )}
        </div>

        {/* Confidence Rating */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">How did it go?</label>
          <div className="flex flex-col gap-2">
            {RATINGS.map(({ key, label, color, desc }) => {
              const isSelected = selectedRating === key;
              const isSuggested = autoSuggested === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedRating(key)}
                  className={`px-4 py-3 rounded-lg text-left transition-all ${
                    isSelected ? COLOR_CLASSES[color].selected : COLOR_CLASSES[color].unselected
                  } ${isSuggested && !isSelected ? COLOR_CLASSES[color].suggested : ''}`}
                >
                  <div className="font-medium text-sm">{label}</div>
                  <div className={`text-xs ${isSelected ? 'text-white/80' : 'opacity-70'}`}>{desc}</div>
                  {isSuggested && <span className="text-xs opacity-70 mt-0.5 block">Suggested based on time</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Notes (key insight, aha moment)</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="e.g., Use sliding window with hash map for O(n)..."
            rows={3}
            className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
