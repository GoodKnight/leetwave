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
