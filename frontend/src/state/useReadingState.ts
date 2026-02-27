import { useState } from 'react';
import { StoryResponse } from '../types';

export const useReadingState = (story: StoryResponse | null) => {
    const [mode, setMode] = useState<'frases' | 'parrafos'>('frases');
    const [currentIndex, setCurrentIndex] = useState(0);

    const getItems = () => {
        if (!story) return [];
        return mode === 'frases' ? story.frases : story.parrafos;
    };

    const items = getItems();
    const totalItems = items.length;

    const next = () => {
        if (currentIndex < totalItems - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const previous = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const toggleMode = (newMode: 'frases' | 'parrafos') => {
        if (mode !== newMode) {
            setMode(newMode);
            setCurrentIndex(0); // Reset progress when switching modes
        }
    };

    const resetProgress = () => {
        setCurrentIndex(0);
    };

    return {
        mode,
        currentIndex,
        totalItems,
        currentItem: items[currentIndex] || '',
        next,
        previous,
        toggleMode,
        resetProgress
    };
};
