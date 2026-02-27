import React from 'react';
import { useReadingState } from '../state/useReadingState';
import { StoryResponse } from '../types';

interface ReadingViewProps {
    story: StoryResponse;
    onRestart: () => void;
}

export const ReadingView: React.FC<ReadingViewProps> = ({ story, onRestart }) => {
    const {
        mode,
        currentIndex,
        totalItems,
        currentItem,
        next,
        previous,
        toggleMode
    } = useReadingState(story);

    return (
        <div className="card">
            <h2 style={{ textAlign: 'center' }}>{story.titulo}</h2>

            <div className="flex justify-between items-center mb-4">
                <span style={{ fontWeight: 'bold' }}>Modo de lectura:</span>
                <div className="flex gap-2">
                    <button
                        type="button"
                        className={mode === 'frases' ? 'btn-primary' : 'btn-outline'}
                        onClick={() => toggleMode('frases')}
                        style={{ padding: '8px 16px', fontSize: '14px', borderRadius: '16px' }}
                    >
                        Frases
                    </button>
                    <button
                        type="button"
                        className={mode === 'parrafos' ? 'btn-primary' : 'btn-outline'}
                        onClick={() => toggleMode('parrafos')}
                        style={{ padding: '8px 16px', fontSize: '14px', borderRadius: '16px' }}
                    >
                        Párrafos
                    </button>
                </div>
            </div>

            <div className="reading-text">
                <p>{currentItem}</p>
            </div>

            <div className="flex justify-between items-center mt-4">
                <button
                    type="button"
                    className="btn-secondary"
                    onClick={previous}
                    disabled={currentIndex === 0}
                >
                    Anterior
                </button>

                <span className="progress-text">
                    Paso {currentIndex + 1} de {totalItems}
                </span>

                <button
                    type="button"
                    className="btn-primary"
                    onClick={next}
                    disabled={currentIndex === totalItems - 1}
                >
                    Siguiente
                </button>
            </div>

            <div className="text-center" style={{ marginTop: '32px' }}>
                <button type="button" className="btn-outline" onClick={onRestart}>
                    🔄 Reiniciar / Leer otro
                </button>
            </div>
        </div>
    );
};
