/**
 * Lógica de aplicación - estado de lectura progresiva
 * Capa: Lógica de aplicación (state/hooks)
 * Maneja modo, índice, reiniciar - NO UI
 */

import { useState, useCallback, useEffect } from 'react';

export type ReadingMode = 'frases' | 'parrafos';

export interface ReadingState {
  mode: ReadingMode;
  index: number;
  total: number;
  canGoPrev: boolean;
  canGoNext: boolean;
}

export function useReadingState(
  frases: string[],
  parrafos: string[],
): {
  mode: ReadingMode;
  setMode: (m: ReadingMode) => void;
  index: number;
  total: number;
  items: string[];
  canGoPrev: boolean;
  canGoNext: boolean;
  goPrev: () => void;
  goNext: () => void;
  reiniciar: () => void;
} {
  const [mode, setMode] = useState<ReadingMode>('frases');
  const [index, setIndex] = useState(0);

  const items = mode === 'frases' ? frases : parrafos;
  const total = items.length;
  const canGoPrev = index > 0;
  const canGoNext = index < total - 1;

  useEffect(() => {
    if (total > 0 && index >= total) {
      setIndex(total - 1);
    } else if (total === 0) {
      setIndex(0);
    }
  }, [mode, total, index]);

  const goPrev = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    setIndex((i) => Math.min(total - 1, i + 1));
  }, [total]);

  const reiniciar = useCallback(() => {
    setIndex(0);
  }, []);

  return {
    mode,
    setMode,
    index,
    total,
    items,
    canGoPrev,
    canGoNext,
    goPrev,
    goNext,
    reiniciar,
  };
}
