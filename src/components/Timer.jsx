import { useApp } from '../context/AppContext';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function Timer() {
  const { timer, setShowCompletionModal } = useApp();

  const handleStop = () => {
    timer.stop();
    setShowCompletionModal(true);
  };

  return (
    <div className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-lg">
      <a
        href={timer.activeProblem?.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-indigo-700 dark:text-indigo-300 truncate max-w-[150px] hover:underline"
        title="Open problem on LeetCode"
      >
        {timer.activeProblem?.title}
      </a>
      <span className="font-mono text-lg font-bold text-indigo-600 dark:text-indigo-400">
        {formatTime(timer.elapsedSeconds)}
      </span>
      <div className="flex gap-1">
        {timer.isPaused ? (
          <button
            onClick={timer.resume}
            className="p-1 rounded text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30"
            title="Resume"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </button>
        ) : (
          <button
            onClick={timer.pause}
            className="p-1 rounded text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
            title="Pause"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
            </svg>
          </button>
        )}
        <button
          onClick={handleStop}
          className="p-1 rounded text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
          title="Stop & Complete"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5.25 3A2.25 2.25 0 003 5.25v9.5A2.25 2.25 0 005.25 17h9.5A2.25 2.25 0 0017 14.75v-9.5A2.25 2.25 0 0014.75 3h-9.5z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
