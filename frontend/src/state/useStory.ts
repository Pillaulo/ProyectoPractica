// ──────────────────────────────────────────────────────────
//  Capa: Lógica de aplicación (state/)
//  Responsabilidad: Gestionar el estado de lectura en memoria
//  del frontend: modo (frases/párrafos), índice actual,
//  navegación, carga y errores.
//  PROHIBIDO: construir prompts, llamar a Groq directamente.
// ──────────────────────────────────────────────────────────

import { useState, useCallback } from 'react';
import { Story, ReadingMode, StoryFormData } from '../types/story';
import { storyApi } from '../services/storyApi';

export interface UseStoryReturn {
  story: Story | null;
  readingMode: ReadingMode;
  currentIndex: number;
  loading: boolean;
  error: string | null;
  generate: (formData: StoryFormData) => Promise<void>;
  setReadingMode: (mode: ReadingMode) => void;
  next: () => void;
  previous: () => void;
  reset: () => void;
  clearStory: () => void;
  clearError: () => void;
}

export function useStory(): UseStoryReturn {
  const [story, setStory] = useState<Story | null>(null);
  const [readingMode, setReadingModeState] = useState<ReadingMode>('frases');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (formData: StoryFormData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await storyApi.generateStory(formData);
      setStory(result);
      setCurrentIndex(0);
      setReadingModeState('frases');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al generar el cuento');
    } finally {
      setLoading(false);
    }
  }, []);

  const setReadingMode = useCallback((mode: ReadingMode) => {
    setReadingModeState(mode);
    setCurrentIndex(0);
  }, []);

  const next = useCallback(() => {
    if (!story) return;
    const items = readingMode === 'frases' ? story.frases : story.parrafos;
    setCurrentIndex((i) => Math.min(i + 1, items.length - 1));
  }, [story, readingMode]);

  const previous = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setCurrentIndex(0);
  }, []);

  const clearStory = useCallback(() => {
    setStory(null);
    setCurrentIndex(0);
    setReadingModeState('frases');
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    story,
    readingMode,
    currentIndex,
    loading,
    error,
    generate,
    setReadingMode,
    next,
    previous,
    reset,
    clearStory,
    clearError,
  };
}
