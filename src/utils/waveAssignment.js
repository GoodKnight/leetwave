const WAVE_MAP = {
  'Arrays & Hashing':        { Easy: 1, Medium: 2, Hard: 9 },
  'Two Pointers':            { Easy: 1, Medium: 2, Hard: 9 },
  'Sliding Window':          { Easy: 1, Medium: 2, Hard: 9 },
  'Stack':                   { Easy: 1, Medium: 2, Hard: 9 },
  'Binary Search':           { Easy: 1, Medium: 2, Hard: 9 },
  'Linked List':             { Easy: 1, Medium: 2, Hard: 9 },
  'Trees':                   { Easy: 3, Medium: 4, Hard: 9 },
  'Heap / Priority Queue':   { Easy: 3, Medium: 4, Hard: 9 },
  'Tries':                   { Easy: 3, Medium: 4, Hard: 9 },
  'Backtracking':            { Easy: 5, Medium: 6, Hard: 9 },
  'Graphs':                  { Easy: 5, Medium: 6, Hard: 9 },
  'Advanced Graphs':         { Easy: 5, Medium: 6, Hard: 9 },
  '1-D Dynamic Programming': { Easy: 7, Medium: 8, Hard: 9 },
  '2-D Dynamic Programming': { Easy: 7, Medium: 8, Hard: 9 },
  'Greedy':                  { Easy: 7, Medium: 8, Hard: 9 },
  'Intervals':               { Easy: 7, Medium: 8, Hard: 9 },
  'Math & Geometry':         { Easy: 7, Medium: 8, Hard: 9 },
  'Bit Manipulation':        { Easy: 7, Medium: 8, Hard: 9 }
};

const WAVE_NAMES = {
  1: 'Foundations',
  2: 'Foundations - Intermediate',
  3: 'Trees & Heaps - Basics',
  4: 'Trees & Heaps - Intermediate',
  5: 'Graphs & Backtracking - Basics',
  6: 'Graphs & Backtracking - Intermediate',
  7: 'Advanced Patterns - Basics',
  8: 'Advanced Patterns - Intermediate',
  9: 'Hard Problems'
};

export function assignWave(topic, difficulty) {
  const wave = WAVE_MAP[topic]?.[difficulty] || 9;
  return { wave, waveName: WAVE_NAMES[wave] };
}
