import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { useApp } from '../context/AppContext';
import { useStats } from '../hooks/useStats';

function formatSeconds(s) {
  if (!s) return '--';
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}m ${sec}s`;
}

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
      {sub && <div className="text-xs text-gray-400 dark:text-gray-500">{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const { allProblems, userProgress, topics, stats: streakStats, reviewDue, resetAllProgress } = useApp();
  const stats = useStats(allProblems, userProgress, topics);

  const today = new Date();
  const startDate = new Date(today);
  startDate.setFullYear(startDate.getFullYear() - 1);

  const heatmapValues = Object.entries(stats.heatmapData).map(([date, count]) => ({
    date,
    count
  }));

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Problems Solved" value={stats.totalSolved} sub={`of ${stats.totalProblems}`} />
        <StatCard label="Progress" value={`${stats.percentComplete}%`} />
        <StatCard label="Current Streak" value={`${streakStats.currentStreak}d`} />
        <StatCard label="Best Streak" value={`${streakStats.bestStreak}d`} />
      </div>

      {/* Review Due */}
      {reviewDue.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/10 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
          <h3 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-1">
            {reviewDue.length} problem{reviewDue.length !== 1 ? 's' : ''} due for review
          </h3>
          <p className="text-sm text-yellow-600 dark:text-yellow-500">
            Head to the Roadmap to start reviewing.
          </p>
        </div>
      )}

      {/* Calendar Heatmap */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold mb-4">Activity</h3>
        <CalendarHeatmap
          startDate={startDate}
          endDate={today}
          values={heatmapValues}
          classForValue={(value) => {
            if (!value || value.count === 0) return 'color-empty';
            if (value.count >= 5) return 'color-scale-4';
            if (value.count >= 3) return 'color-scale-3';
            if (value.count >= 2) return 'color-scale-2';
            return 'color-scale-1';
          }}
          titleForValue={(value) => {
            if (!value || !value.date) return 'No problems';
            return `${value.date}: ${value.count} problem${value.count !== 1 ? 's' : ''}`;
          }}
          showWeekdayLabels
        />
      </div>

      {/* Difficulty Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold mb-4">Difficulty Breakdown</h3>
        <div className="grid grid-cols-3 gap-4">
          {stats.difficultyBreakdown.map(({ difficulty, solved, total }) => {
            const colors = { Easy: 'text-green-500', Medium: 'text-yellow-500', Hard: 'text-red-500' };
            return (
              <div key={difficulty} className="text-center">
                <div className={`text-2xl font-bold ${colors[difficulty]}`}>{solved}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">/ {total} {difficulty}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Average Solve Time */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold mb-4">Average Solve Time</h3>
        <div className="grid grid-cols-3 gap-4">
          {['Easy', 'Medium', 'Hard'].map(diff => (
            <div key={diff} className="text-center">
              <div className="text-xl font-bold">{formatSeconds(stats.avgTimeByDifficulty[diff])}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{diff}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Topic Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold mb-4">Topic Progress</h3>
        <div className="space-y-3">
          {stats.topicBreakdown.map(({ topic, solved, total, percentage }) => (
            <div key={topic}>
              <div className="flex justify-between text-sm mb-1">
                <span>{topic}</span>
                <span className="text-gray-500 dark:text-gray-400">{solved}/{total}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Source List Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold mb-4">Source List Progress</h3>
        <div className="space-y-3">
          {stats.sourceProgress.map(({ label, solved, total, percentage }) => (
            <div key={label}>
              <div className="flex justify-between text-sm mb-1">
                <span>{label}</span>
                <span className="text-gray-500 dark:text-gray-400">{solved}/{total} ({percentage}%)</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reset */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-red-200 dark:border-red-900">
        <h3 className="font-semibold mb-2 text-red-600 dark:text-red-400">Danger Zone</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          This will erase all your solve history, streaks, and notes. The problem list itself is not affected.
        </p>
        <button
          onClick={() => {
            if (window.confirm('Reset ALL progress? This cannot be undone.')) {
              resetAllProgress();
            }
          }}
          className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          Reset All Progress
        </button>
      </div>
    </div>
  );
}
