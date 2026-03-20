import { useState, useRef, useCallback, useEffect } from 'react';

export function useTimer() {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeProblem, setActiveProblem] = useState(null);
  const intervalRef = useRef(null);
  // Track wall clock time instead of counting ticks
  const startTimeRef = useRef(null);      // when the timer started (or resumed)
  const accumulatedRef = useRef(0);       // seconds banked before a pause

  const tick = useCallback(() => {
    const now = Date.now();
    const currentSegment = Math.floor((now - startTimeRef.current) / 1000);
    setElapsedSeconds(accumulatedRef.current + currentSegment);
  }, []);

  const start = useCallback((problem) => {
    setActiveProblem(problem);
    setElapsedSeconds(0);
    setIsRunning(true);
    setIsPaused(false);
    accumulatedRef.current = 0;
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(tick, 1000);
  }, [tick]);

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    // Bank the elapsed time from this segment
    const now = Date.now();
    accumulatedRef.current += Math.floor((now - startTimeRef.current) / 1000);
    startTimeRef.current = null;
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(tick, 1000);
  }, [tick]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    // Do one final tick to get accurate time
    if (startTimeRef.current) {
      const now = Date.now();
      accumulatedRef.current += Math.floor((now - startTimeRef.current) / 1000);
      setElapsedSeconds(accumulatedRef.current);
    }
    setIsRunning(false);
    setIsPaused(false);
  }, []);

  const reset = useCallback(() => {
    setElapsedSeconds(0);
    setActiveProblem(null);
    accumulatedRef.current = 0;
    startTimeRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return {
    elapsedSeconds,
    setElapsedSeconds,
    isRunning,
    isPaused,
    activeProblem,
    start,
    pause,
    resume,
    stop,
    reset
  };
}
