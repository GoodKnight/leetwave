import { useState } from 'react';
import { useApp } from '../context/AppContext';
import NextProblem from './NextProblem';
import ProblemRow from './ProblemRow';
import FilterBar from './FilterBar';

export default function RoadmapView() {
  const { problemsByTopic, topics, getStatus, allProblems, userProgress } = useApp();
  const [collapsedTopics, setCollapsedTopics] = useState({});

  const toggleTopic = (topic) => {
    setCollapsedTopics(prev => ({ ...prev, [topic]: !prev[topic] }));
  };

  const totalSolved = allProblems.filter(p => userProgress[p.id]?.status === 'solved').length;
  const totalProblems = allProblems.length;
  const overallPercent = totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0;

  return (
    <div>
      <NextProblem />

      {/* Overall Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="font-medium">{totalSolved} / {totalProblems} problems solved</span>
          <span className="text-gray-500 dark:text-gray-400">{overallPercent}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
      </div>

      <FilterBar />

      {/* Topic Sections */}
      <div className="space-y-2">
        {topics.map(topic => {
          const problems = problemsByTopic[topic] || [];
          if (problems.length === 0) return null;

          const solved = problems.filter(p => getStatus(p.id) === 'solved').length;
          const percent = Math.round((solved / problems.length) * 100);
          const isCollapsed = collapsedTopics[topic];

          return (
            <div key={topic} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <button
                onClick={() => toggleTopic(topic)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${isCollapsed ? '' : 'rotate-90'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.293 4.293a1 1 0 011.414 0L14 10.586a1 1 0 010 1.414l-6.293 6.293a1 1 0 01-1.414-1.414L11.586 11 6.293 5.707a1 1 0 010-1.414z" />
                  </svg>
                  <h3 className="font-semibold text-sm">{topic}</h3>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {solved}/{problems.length}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-indigo-600 dark:bg-indigo-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-8 text-right">{percent}%</span>
                </div>
              </button>
              {!isCollapsed && (
                <div className="border-t border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700/50">
                  {problems.map(p => (
                    <ProblemRow key={p.id} problem={p} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
