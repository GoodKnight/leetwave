import { useState } from 'react';
import { useApp } from '../context/AppContext';

const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Hard'];

const EMPTY_FORM = {
  leetcodeNumber: '',
  title: '',
  url: '',
  difficulty: 'Easy',
  topic: 'Arrays & Hashing',
  patterns: '',
  sources: '',
  neetcodeVideo: ''
};

export default function CustomProblems() {
  const { topics, customProblems, allProblems, addCustomProblem, updateCustomProblem, deleteCustomProblem, getStatus } = useApp();
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [lcWarning, setLcWarning] = useState('');
  const [titleWarning, setTitleWarning] = useState('');

  const checkLcNumber = (value) => {
    const lcNum = parseInt(value) || 0;
    if (lcNum > 0) {
      const existing = allProblems.find(p => p.leetcodeNumber === lcNum && p.id !== editingId);
      if (existing) {
        setLcWarning(`LeetCode #${lcNum} already exists: "${existing.title}"`);
        return;
      }
    }
    setLcWarning('');
  };

  const checkTitle = (value) => {
    const title = value.trim();
    if (title) {
      const existing = allProblems.find(p => p.title.toLowerCase() === title.toLowerCase() && p.id !== editingId);
      if (existing) {
        setTitleWarning(`A problem named "${existing.title}" already exists.`);
        return;
      }
    }
    setTitleWarning('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) return;

    const lcNum = parseInt(form.leetcodeNumber) || 0;
    const title = form.title.trim();

    // Run duplicate checks at submit time too (in case blur didn't fire)
    if (lcNum > 0) {
      const lcMatch = allProblems.find(p => p.leetcodeNumber === lcNum && p.id !== editingId);
      if (lcMatch) {
        setLcWarning(`LeetCode #${lcNum} already exists: "${lcMatch.title}"`);
        setError('Please fix the issues above before submitting.');
        return;
      }
    }
    const titleMatch = allProblems.find(p => p.title.toLowerCase() === title.toLowerCase() && p.id !== editingId);
    if (titleMatch) {
      setTitleWarning(`A problem named "${titleMatch.title}" already exists.`);
      setError('Please fix the issues above before submitting.');
      return;
    }

    // Block submit if there are active warnings
    if (lcWarning || titleWarning) {
      setError('Please fix the issues above before submitting.');
      return;
    }

    const data = {
      leetcodeNumber: lcNum,
      title,
      url: form.url.trim() || undefined,
      difficulty: form.difficulty,
      topic: form.topic,
      patterns: form.patterns ? form.patterns.split(',').map(p => p.trim()).filter(Boolean) : [],
      sources: form.sources ? form.sources.split(',').map(s => s.trim()).filter(Boolean) : [],
      neetcodeVideo: form.neetcodeVideo.trim() || undefined
    };

    if (editingId) {
      updateCustomProblem(editingId, data);
      setEditingId(null);
    } else {
      addCustomProblem(data);
    }
    setForm(EMPTY_FORM);
    setLcWarning('');
    setTitleWarning('');
  };

  const handleEdit = (problem) => {
    setEditingId(problem.id);
    setForm({
      leetcodeNumber: problem.leetcodeNumber || '',
      title: problem.title,
      url: problem.url || '',
      difficulty: problem.difficulty,
      topic: problem.topic,
      patterns: problem.patterns.join(', '),
      sources: problem.sources.join(', '),
      neetcodeVideo: problem.neetcodeVideo || ''
    });
  };

  const handleDelete = (problem) => {
    if (window.confirm(`Delete "${problem.title}"? This also removes any solve history.`)) {
      deleteCustomProblem(problem.id);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError('');
    setLcWarning('');
    setTitleWarning('');
  };

  const diffColors = {
    Easy: 'text-green-500',
    Medium: 'text-yellow-500',
    Hard: 'text-red-500'
  };

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold mb-4">{editingId ? 'Edit Problem' : 'Add Custom Problem'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Title <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                onBlur={e => checkTitle(e.target.value)}
                placeholder="e.g., Two Sum"
                required
                className={`w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 border text-sm ${
                  titleWarning ? 'border-red-400 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {titleWarning && <p className="text-xs text-red-500 mt-1">{titleWarning}</p>}
            </div>

            {/* LC Number */}
            <div>
              <label className="block text-sm font-medium mb-1">LeetCode Number</label>
              <input
                type="number"
                value={form.leetcodeNumber}
                onChange={e => setForm(f => ({ ...f, leetcodeNumber: e.target.value }))}
                onBlur={e => checkLcNumber(e.target.value)}
                placeholder="e.g., 1"
                className={`w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 border text-sm ${
                  lcWarning ? 'border-red-400 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {lcWarning && <p className="text-xs text-red-500 mt-1">{lcWarning}</p>}
            </div>

            {/* URL */}
            <div>
              <label className="block text-sm font-medium mb-1">URL <span className="text-xs text-gray-400">(auto-generated if blank)</span></label>
              <input
                type="url"
                value={form.url}
                onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                placeholder="https://leetcode.com/problems/..."
                className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm"
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium mb-1">Difficulty <span className="text-red-400">*</span></label>
              <div className="flex gap-2">
                {DIFFICULTY_OPTIONS.map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, difficulty: d }))}
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      form.difficulty === d
                        ? d === 'Easy' ? 'bg-green-600 text-white'
                          : d === 'Medium' ? 'bg-yellow-500 text-white'
                          : 'bg-red-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic */}
            <div>
              <label className="block text-sm font-medium mb-1">Topic <span className="text-red-400">*</span></label>
              <select
                value={form.topic}
                onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
                className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm"
              >
                {topics.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Patterns */}
            <div>
              <label className="block text-sm font-medium mb-1">Patterns <span className="text-xs text-gray-400">(comma-separated)</span></label>
              <input
                type="text"
                value={form.patterns}
                onChange={e => setForm(f => ({ ...f, patterns: e.target.value }))}
                placeholder="e.g., hash map, two pointers"
                className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm"
              />
            </div>

            {/* Sources */}
            <div>
              <label className="block text-sm font-medium mb-1">Source Tags <span className="text-xs text-gray-400">(comma-separated)</span></label>
              <input
                type="text"
                value={form.sources}
                onChange={e => setForm(f => ({ ...f, sources: e.target.value }))}
                placeholder="e.g., Google, Meta"
                className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm"
              />
            </div>

            {/* NeetCode Video */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">NeetCode Video URL</label>
              <input
                type="url"
                value={form.neetcodeVideo}
                onChange={e => setForm(f => ({ ...f, neetcodeVideo: e.target.value }))}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm"
              />
            </div>
          </div>

          {error && (
            <div className="px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              {editingId ? 'Save Changes' : 'Add Problem'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Custom Problems List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold">Your Custom Problems ({customProblems.length})</h2>
        </div>
        {customProblems.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            No custom problems yet. Use the form above to add your first one.
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {customProblems.map(problem => {
              const status = getStatus(problem.id);
              return (
                <div key={problem.id} className="px-6 py-3 flex items-center gap-4">
                  {/* Status */}
                  {status === 'solved' ? (
                    <span className="w-5 h-5 rounded-full bg-green-500 inline-flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 inline-flex flex-shrink-0" />
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <a
                        href={problem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 truncate"
                      >
                        {problem.leetcodeNumber ? `#${problem.leetcodeNumber} ` : ''}{problem.title}
                      </a>
                    </div>
                    <div className="flex flex-wrap items-center gap-1 mt-0.5">
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">{problem.topic}</span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">&middot; Wave {problem.wave}</span>
                      {problem.sources.map(s => (
                        <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">{s}</span>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty */}
                  <span className={`flex-shrink-0 text-sm font-medium ${diffColors[problem.difficulty]}`}>
                    {problem.difficulty}
                  </span>

                  {/* Actions */}
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(problem)}
                      className="p-1.5 rounded text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(problem)}
                      className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
