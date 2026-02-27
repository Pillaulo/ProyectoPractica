import { useState } from 'react';
import { StoryRequest, StoryResponse } from '../types';
import { generateStory } from '../services/storyApi';

export const useStoryGeneration = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [story, setStory] = useState<StoryResponse | null>(null);

    const generate = async (request: StoryRequest) => {
        setLoading(true);
        setError(null);
        try {
            const result = await generateStory(request);
            setStory(result);
        } catch (err: any) {
            setError(err.message || 'Error al generar el cuento');
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setStory(null);
        setError(null);
    };

    const loadStory = (loadedStory: StoryResponse) => {
        setStory(loadedStory);
        setError(null);
    };

    return { loading, error, story, generate, reset, loadStory };
};
