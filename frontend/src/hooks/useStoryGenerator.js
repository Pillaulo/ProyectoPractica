import { useState, useCallback } from 'react';
import { generateStory } from '../services/storyApi';

export function useStoryGenerator() {
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    setStory(null);
    try {
      const result = await generateStory(formData);
      setStory(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearStory = useCallback(() => {
    setStory(null);
    setError(null);
  }, []);

  return { story, loading, error, generate, clearStory, setStory };
}
