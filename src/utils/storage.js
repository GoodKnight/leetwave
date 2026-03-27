const STORAGE_KEY = 'leetwave';

export function getDefaultSettings() {
  return {
    activeSources: ['neetcode150', 'blind75', 'grind75', 'algomap', 'seanprashad', 'leetcode75', 'topinterview150'],
    theme: 'dark',
    studyMode: 'wave'
  };
}

export function getDefaultStats() {
  return {
    currentStreak: 0,
    bestStreak: 0,
    streakLastDate: null
  };
}

function loadState() {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;
    return JSON.parse(serialized);
  } catch (e) {
    console.error('Failed to load state:', e);
    return null;
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

export function loadUserProgress() {
  const state = loadState();
  return state?.userProgress || {};
}

export function saveUserProgress(progress) {
  const state = loadState() || {};
  state.userProgress = progress;
  saveState(state);
}

export function loadSettings() {
  const state = loadState();
  return state?.settings || getDefaultSettings();
}

export function saveSettings(settings) {
  const state = loadState() || {};
  state.settings = settings;
  saveState(state);
}

export function loadStats() {
  const state = loadState();
  return state?.stats || getDefaultStats();
}

export function saveStats(stats) {
  const state = loadState() || {};
  state.stats = stats;
  saveState(state);
}

export function loadCustomProblems() {
  const state = loadState();
  return state?.customProblems || [];
}

export function saveCustomProblems(problems) {
  const state = loadState() || {};
  state.customProblems = problems;
  saveState(state);
}

export function generateId() {
  return 'custom-' + crypto.randomUUID().slice(0, 8);
}

export function exportData() {
  const state = loadState() || {};
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const date = new Date().toISOString().split('T')[0];
  const a = document.createElement('a');
  a.href = url;
  a.download = `leetwave-backup-${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.userProgress && !data.settings && !data.stats) {
          reject(new Error('This file does not look like a LeetWave backup.'));
          return;
        }
        saveState(data);
        resolve(data);
      } catch {
        reject(new Error('Invalid JSON file.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsText(file);
  });
}
