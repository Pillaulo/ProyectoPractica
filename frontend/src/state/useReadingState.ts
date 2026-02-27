import { useMemo, useState } from 'react';

export type ReadingMode = 'frases' | 'parrafos';

export function useReadingState(frases: string[], parrafos: string[]) {
  const [mode, setMode] = useState<ReadingMode>('frases');
  const [index, setIndex] = useState(0);

  const items = useMemo(() => (mode === 'frases' ? frases : parrafos), [mode, frases, parrafos]);
  const total = items.length;
  const safeIndex = total === 0 ? 0 : Math.min(Math.max(index, 0), total - 1);

  const canPrev = safeIndex > 0;
  const canNext = safeIndex < total - 1;

  function prev() {
    setIndex((i) => Math.max(0, i - 1));
  }
  function next() {
    setIndex((i) => (total === 0 ? 0 : Math.min(total - 1, i + 1)));
  }
  function reset() {
    setIndex(0);
  }
  function setReadingMode(newMode: ReadingMode) {
    setMode(newMode);
    setIndex(0);
  }

  return {
    mode,
    setMode: setReadingMode,
    index: safeIndex,
    total,
    item: items[safeIndex] ?? '',
    canPrev,
    canNext,
    prev,
    next,
    reset,
  };
}

