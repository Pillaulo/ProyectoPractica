import { useState, useMemo, useCallback } from 'react';

export function useStoryReader(story) {
  const [mode, setMode] = useState('frases');
  const [index, setIndex] = useState(0);

  const items = useMemo(() => {
    if (!story) return [];
    return mode === 'frases' ? story.frases : story.parrafos;
  }, [story, mode]);

  const total = items.length;

  const goNext = useCallback(() => {
    setIndex((prev) => Math.min(prev + 1, total - 1));
  }, [total]);

  const goPrev = useCallback(() => {
    setIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setIndex(0);
  }, []);

  const changeMode = useCallback((newMode) => {
    setMode(newMode);
    setIndex(0);
  }, []);

  return {
    mode,
    changeMode,
    index,
    total,
    currentItem: items[index] || '',
    goNext,
    goPrev,
    reset,
    isFirst: index === 0,
    isLast: index >= total - 1,
  };
}
