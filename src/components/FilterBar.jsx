import { useApp } from '../context/AppContext';

const SOURCE_OPTIONS = [
  { key: 'neetcode150', label: 'NC 150', title: 'NeetCode 150', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  { key: 'blind75', label: 'B75', title: 'Blind 75', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  { key: 'grind75', label: 'G75', title: 'Grind 75', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  { key: 'algomap', label: 'AM', title: 'Algomap', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  { key: 'seanprashad', label: 'SP', title: "Sean Prashad's LeetCode Patterns", color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' },
  { key: 'leetcode75', label: 'LC75', title: 'LeetCode 75 Study Plan', color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' },
  { key: 'topinterview150', label: 'TI150', title: 'Top Interview 150', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' }
];

const DIFFICULTY_OPTIONS = [
  { key: 'Easy', label: 'Easy', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  { key: 'Medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  { key: 'Hard', label: 'Hard', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' }
];

const STATUS_OPTIONS = [
  { key: 'unsolved', label: 'Unsolved' },
  { key: 'solved', label: 'Solved' },
  { key: 'review', label: 'Review Due' }
];

function TogglePill({ label, title, isActive, color, onClick }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
        isActive
          ? color + ' ring-2 ring-offset-1 dark:ring-offset-gray-900 ring-current'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
      }`}
    >
      {label}
    </button>
  );
}

const KNOWN_SOURCES = new Set(SOURCE_OPTIONS.map(s => s.key));

export default function FilterBar() {
  const { filters, updateFilters, topics, settings, updateSettings, allSources } = useApp();

  // Add custom source tags dynamically
  const customSourceOptions = allSources
    .filter(s => !KNOWN_SOURCES.has(s))
    .map(s => ({
      key: s,
      label: s,
      title: s,
      color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400'
    }));

  const combinedSourceOptions = [...SOURCE_OPTIONS, ...customSourceOptions];

  const toggleFilter = (type, value) => {
    const current = filters[type];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilters({ [type]: updated });
  };

  const hasActiveFilters = filters.sources.length > 0 || filters.difficulties.length > 0 ||
    filters.topics.length > 0 || filters.statuses.length > 0;

  return (
    <div className="space-y-3 mb-6">
      {/* Study Mode Toggle */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Mode:</span>
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
          <button
            onClick={() => updateSettings({ studyMode: 'wave' })}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              settings.studyMode === 'wave'
                ? 'bg-white dark:bg-gray-600 text-indigo-700 dark:text-indigo-300 shadow-sm'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Wave
          </button>
          <button
            onClick={() => updateSettings({ studyMode: 'deepdive' })}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              settings.studyMode === 'deepdive'
                ? 'bg-white dark:bg-gray-600 text-indigo-700 dark:text-indigo-300 shadow-sm'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Deep Dive
          </button>
        </div>
      </div>

      {/* Source Filters */}
      <div className="flex flex-wrap gap-1.5">
        <span className="text-xs text-gray-500 dark:text-gray-400 self-center mr-1">Sources:</span>
        {combinedSourceOptions.map(({ key, label, title, color }) => (
          <TogglePill
            key={key}
            label={label}
            title={title}
            isActive={filters.sources.includes(key)}
            color={color}
            onClick={() => toggleFilter('sources', key)}
          />
        ))}
      </div>

      {/* Difficulty Filters */}
      <div className="flex flex-wrap gap-1.5">
        <span className="text-xs text-gray-500 dark:text-gray-400 self-center mr-1">Difficulty:</span>
        {DIFFICULTY_OPTIONS.map(({ key, label, color }) => (
          <TogglePill
            key={key}
            label={label}
            isActive={filters.difficulties.includes(key)}
            color={color}
            onClick={() => toggleFilter('difficulties', key)}
          />
        ))}
      </div>

      {/* Topic Filter */}
      <div className="flex flex-wrap gap-1.5">
        <span className="text-xs text-gray-500 dark:text-gray-400 self-center mr-1">Topics:</span>
        <select
          value=""
          onChange={e => { if (e.target.value) toggleFilter('topics', e.target.value); }}
          className="text-xs bg-gray-100 dark:bg-gray-700 rounded-md px-2 py-1 border-none"
        >
          <option value="">+ Add topic filter</option>
          {topics.filter(t => !filters.topics.includes(t)).map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {filters.topics.map(t => (
          <button
            key={t}
            onClick={() => toggleFilter('topics', t)}
            className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400"
          >
            {t} &times;
          </button>
        ))}
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-1.5">
        <span className="text-xs text-gray-500 dark:text-gray-400 self-center mr-1">Status:</span>
        {STATUS_OPTIONS.map(({ key, label }) => (
          <TogglePill
            key={key}
            label={label}
            isActive={filters.statuses.includes(key)}
            color="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
            onClick={() => toggleFilter('statuses', key)}
          />
        ))}
      </div>

      {/* Clear All */}
      {hasActiveFilters && (
        <button
          onClick={() => updateFilters({ sources: [], difficulties: [], topics: [], statuses: [] })}
          className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
