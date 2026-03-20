import { useMemo } from 'react';

export function useStats(problems, userProgress, topics) {
  return useMemo(() => {
    const totalSolved = problems.filter(p => userProgress[p.id]?.status === 'solved').length;

    // Topic breakdown
    const topicBreakdown = topics.map(topic => {
      const topicProblems = problems.filter(p => p.topic === topic);
      const topicSolved = topicProblems.filter(p => userProgress[p.id]?.status === 'solved');
      return {
        topic,
        total: topicProblems.length,
        solved: topicSolved.length,
        percentage: topicProblems.length > 0 ? Math.round((topicSolved.length / topicProblems.length) * 100) : 0
      };
    });

    // Difficulty breakdown
    const difficultyBreakdown = ['Easy', 'Medium', 'Hard'].map(diff => {
      const diffProblems = problems.filter(p => p.difficulty === diff);
      const diffSolved = diffProblems.filter(p => userProgress[p.id]?.status === 'solved');
      return { difficulty: diff, total: diffProblems.length, solved: diffSolved.length };
    });

    // Heatmap data
    const heatmapData = {};
    Object.values(userProgress).forEach(progress => {
      if (progress.confidenceHistory) {
        progress.confidenceHistory.forEach(entry => {
          if (entry.date) {
            heatmapData[entry.date] = (heatmapData[entry.date] || 0) + 1;
          }
        });
      }
    });

    // Source list progress
    const sourceLabels = {
      neetcode150: 'NeetCode 150',
      blind75: 'Blind 75',
      grind75: 'Grind 75',
      algomap: 'Algomap',
      seanprashad: 'Sean Prashad',
      leetcode75: 'LeetCode 75',
      topinterview150: 'Top Interview 150'
    };

    const sourceProgress = Object.entries(sourceLabels).map(([key, label]) => {
      const sourceProblems = problems.filter(p => p.sources.includes(key));
      const sourceSolved = sourceProblems.filter(p => userProgress[p.id]?.status === 'solved');
      return {
        key,
        label,
        total: sourceProblems.length,
        solved: sourceSolved.length,
        percentage: sourceProblems.length > 0 ? Math.round((sourceSolved.length / sourceProblems.length) * 100) : 0
      };
    });

    // Average solve time by difficulty
    const avgTimeByDifficulty = {};
    ['Easy', 'Medium', 'Hard'].forEach(diff => {
      const times = [];
      problems.forEach(p => {
        if (p.difficulty === diff && userProgress[p.id]?.confidenceHistory) {
          userProgress[p.id].confidenceHistory.forEach(entry => {
            if (entry.timeSpent && !entry.gaveUp) times.push(entry.timeSpent);
          });
        }
      });
      avgTimeByDifficulty[diff] = times.length > 0
        ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
        : 0;
    });

    return {
      totalSolved,
      totalProblems: problems.length,
      percentComplete: Math.round((totalSolved / problems.length) * 100),
      topicBreakdown,
      difficultyBreakdown,
      heatmapData,
      sourceProgress,
      avgTimeByDifficulty
    };
  }, [problems, userProgress, topics]);
}
