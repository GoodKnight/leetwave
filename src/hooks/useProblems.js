import { useState, useCallback, useMemo, useEffect } from 'react';
import seedData from '../data/seedData.json';
import { loadUserProgress, saveUserProgress, loadSettings, saveSettings, loadStats, saveStats, loadCustomProblems, saveCustomProblems, generateId, getDefaultSettings, getDefaultStats } from '../utils/storage';
import { assignWave } from '../utils/waveAssignment';
import { formatDate, isPastDue } from '../utils/dateUtils';
import { getNewReviewState } from '../utils/spacedRepetition';

const defaultFilters = {
  sources: [],
  difficulties: [],
  topics: [],
  statuses: []
};

export function useProblems() {
  const [userProgress, setUserProgress] = useState(() => loadUserProgress());
  const [settings, setSettings] = useState(() => loadSettings());
  const [stats, setStats] = useState(() => loadStats());
  const [customProblems, setCustomProblems] = useState(() => loadCustomProblems());
  const [filters, setFilters] = useState(defaultFilters);

  const topics = seedData.topics;

  // Merge seed data with custom problems
  const problems = useMemo(() => {
    return [...seedData.problems, ...customProblems];
  }, [customProblems]);

  // Collect all unique source keys (including custom ones)
  const allSources = useMemo(() => {
    const sourceSet = new Set();
    problems.forEach(p => p.sources.forEach(s => sourceSet.add(s)));
    return [...sourceSet];
  }, [problems]);

  // Persist to localStorage on changes
  useEffect(() => { saveUserProgress(userProgress); }, [userProgress]);
  useEffect(() => { saveSettings(settings); }, [settings]);
  useEffect(() => { saveStats(stats); }, [stats]);
  useEffect(() => { saveCustomProblems(customProblems); }, [customProblems]);

  const getStatus = useCallback((problemId) => {
    const progress = userProgress[problemId];
    if (!progress) return 'unsolved';
    if (progress.nextReviewDate && isPastDue(progress.nextReviewDate)) return 'review';
    return progress.status || 'unsolved';
  }, [userProgress]);

  // Filter problems
  const filteredProblems = useMemo(() => {
    return problems.filter(p => {
      if (filters.sources.length > 0 && !filters.sources.some(s => p.sources.includes(s))) return false;
      if (filters.difficulties.length > 0 && !filters.difficulties.includes(p.difficulty)) return false;
      if (filters.topics.length > 0 && !filters.topics.includes(p.topic)) return false;
      if (filters.statuses.length > 0 && !filters.statuses.includes(getStatus(p.id))) return false;
      return true;
    });
  }, [problems, filters, getStatus]);

  // Sort based on study mode
  const sortedProblems = useMemo(() => {
    const sorted = [...filteredProblems];
    if (settings.studyMode === 'deepdive') {
      sorted.sort((a, b) => {
        const topicIndexA = topics.indexOf(a.topic);
        const topicIndexB = topics.indexOf(b.topic);
        if (topicIndexA !== topicIndexB) return topicIndexA - topicIndexB;
        const diffOrder = { Easy: 0, Medium: 1, Hard: 2 };
        if (diffOrder[a.difficulty] !== diffOrder[b.difficulty]) return diffOrder[a.difficulty] - diffOrder[b.difficulty];
        if (b.sources.length !== a.sources.length) return b.sources.length - a.sources.length;
        return a.topicOrder - b.topicOrder;
      });
    } else {
      sorted.sort((a, b) => a.roadmapOrder - b.roadmapOrder);
    }
    return sorted;
  }, [filteredProblems, settings.studyMode, topics]);

  // Group by topic
  const problemsByTopic = useMemo(() => {
    const groups = {};
    for (const topic of topics) {
      groups[topic] = sortedProblems.filter(p => p.topic === topic);
    }
    return groups;
  }, [sortedProblems, topics]);

  // Review queue
  const reviewDue = useMemo(() => {
    return problems.filter(p => {
      const progress = userProgress[p.id];
      if (!progress) return false;
      return progress.nextReviewDate && isPastDue(progress.nextReviewDate);
    });
  }, [problems, userProgress]);

  // Next problem (review first, then next unsolved)
  const nextProblem = useMemo(() => {
    if (reviewDue.length > 0) {
      return { problem: reviewDue[0], isReview: true };
    }

    const allSorted = [...problems];
    if (settings.studyMode === 'deepdive') {
      allSorted.sort((a, b) => {
        const topicIndexA = topics.indexOf(a.topic);
        const topicIndexB = topics.indexOf(b.topic);
        if (topicIndexA !== topicIndexB) return topicIndexA - topicIndexB;
        const diffOrder = { Easy: 0, Medium: 1, Hard: 2 };
        if (diffOrder[a.difficulty] !== diffOrder[b.difficulty]) return diffOrder[a.difficulty] - diffOrder[b.difficulty];
        if (b.sources.length !== a.sources.length) return b.sources.length - a.sources.length;
        return a.topicOrder - b.topicOrder;
      });
    } else {
      allSorted.sort((a, b) => a.roadmapOrder - b.roadmapOrder);
    }

    const next = allSorted.find(p => getStatus(p.id) === 'unsolved');
    return next ? { problem: next, isReview: false } : null;
  }, [problems, userProgress, settings.studyMode, reviewDue, getStatus, topics]);

  // Complete a problem
  const completeProblem = useCallback((problemId, { rating, timeSpent, timeEdited, notes, gaveUp, autoSuggested }) => {
    setUserProgress(prev => {
      const existing = prev[problemId] || {};
      const attempt = (existing.confidenceHistory?.length || 0) + 1;
      const newEntry = {
        date: formatDate(new Date()),
        rating,
        autoSuggested,
        timeSpent,
        timeEdited,
        gaveUp: gaveUp || false,
        attempt
      };

      const confidenceHistory = [...(existing.confidenceHistory || []), newEntry];
      const reviewState = getNewReviewState(rating, existing);

      return {
        ...prev,
        [problemId]: {
          ...existing,
          status: 'solved',
          confidenceHistory,
          notes: notes || existing.notes,
          lastReviewDate: formatDate(new Date()),
          ...reviewState
        }
      };
    });

    // Update streak
    setStats(prev => {
      const today = formatDate(new Date());
      if (prev.streakLastDate === today) return prev;

      const yesterday = formatDate(new Date(Date.now() - 86400000));
      let newStreak;
      if (prev.streakLastDate === yesterday) {
        newStreak = prev.currentStreak + 1;
      } else if (!prev.streakLastDate) {
        newStreak = 1;
      } else {
        newStreak = 1;
      }

      return {
        currentStreak: newStreak,
        bestStreak: Math.max(newStreak, prev.bestStreak),
        streakLastDate: today
      };
    });
  }, []);

  // Reset a single problem back to unsolved
  const resetProblem = useCallback((problemId) => {
    setUserProgress(prev => {
      const updated = { ...prev };
      delete updated[problemId];
      return updated;
    });
  }, []);

  // Reset all progress
  const resetAllProgress = useCallback(() => {
    setUserProgress({});
    setStats(getDefaultStats());
  }, []);

  // Update notes for a problem
  const updateNotes = useCallback((problemId, notes) => {
    setUserProgress(prev => ({
      ...prev,
      [problemId]: {
        ...prev[problemId],
        notes
      }
    }));
  }, []);

  // Custom problem management
  const addCustomProblem = useCallback(({ leetcodeNumber, title, url, difficulty, topic, patterns, sources, neetcodeVideo }) => {
    const { wave, waveName } = assignWave(topic, difficulty);
    // Place custom problems at end of their wave for roadmapOrder
    const maxOrder = problems.filter(p => p.wave === wave).reduce((max, p) => Math.max(max, p.roadmapOrder || 0), 0);
    const maxTopicOrder = problems.filter(p => p.topic === topic).reduce((max, p) => Math.max(max, p.topicOrder || 0), 0);

    const newProblem = {
      id: generateId(),
      leetcodeNumber: leetcodeNumber || 0,
      title,
      url: url || `https://leetcode.com/problems/${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}/`,
      difficulty,
      topic,
      patterns: patterns || [],
      sources: sources || [],
      neetcodeVideo: neetcodeVideo || null,
      algomapDifficultyScore: null,
      topicOrder: maxTopicOrder + 1,
      roadmapOrder: maxOrder + 1,
      wave,
      waveName,
      isCustom: true
    };

    setCustomProblems(prev => [...prev, newProblem]);
    return newProblem;
  }, [problems]);

  const updateCustomProblem = useCallback((id, updates) => {
    setCustomProblems(prev => prev.map(p => {
      if (p.id !== id) return p;
      const updated = { ...p, ...updates };
      // Recalculate wave if topic or difficulty changed
      if (updates.topic || updates.difficulty) {
        const { wave, waveName } = assignWave(updated.topic, updated.difficulty);
        updated.wave = wave;
        updated.waveName = waveName;
      }
      return updated;
    }));
  }, []);

  const deleteCustomProblem = useCallback((id) => {
    setCustomProblems(prev => prev.filter(p => p.id !== id));
    // Clean up any progress data for this problem
    setUserProgress(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  }, []);

  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    problems: sortedProblems,
    allProblems: problems,
    topics,
    problemsByTopic,
    userProgress,
    settings,
    stats,
    filters,
    nextProblem,
    reviewDue,
    getStatus,
    completeProblem,
    resetProblem,
    resetAllProgress,
    updateNotes,
    customProblems,
    addCustomProblem,
    updateCustomProblem,
    deleteCustomProblem,
    allSources,
    updateSettings,
    updateFilters
  };
}
