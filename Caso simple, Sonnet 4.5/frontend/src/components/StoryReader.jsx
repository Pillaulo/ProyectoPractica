import { useState } from 'react';

function StoryReader({ story, onReset }) {
    const [mode, setMode] = useState('frases'); // 'frases' or 'parrafos'
    const [currentIndex, setCurrentIndex] = useState(0);

    const content = mode === 'frases' ? story.frases : story.parrafos;
    const totalSteps = content.length;

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < totalSteps - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleModeChange = (newMode) => {
        setMode(newMode);
        setCurrentIndex(0); // Reset to first step when changing mode
    };

    return (
        <div className="card">
            <div className="reader-header">
                <h2 className="reader-title">{story.titulo}</h2>

                <div className="mode-selector">
                    <button
                        className={`mode-btn ${mode === 'frases' ? 'active' : ''}`}
                        onClick={() => handleModeChange('frases')}
                    >
                        Frases
                    </button>
                    <button
                        className={`mode-btn ${mode === 'parrafos' ? 'active' : ''}`}
                        onClick={() => handleModeChange('parrafos')}
                    >
                        Párrafos
                    </button>
                </div>
            </div>

            <div className="story-content">
                {content[currentIndex]}
            </div>

            <div className="navigation">
                <div className="nav-buttons">
                    <button
                        className="btn btn-secondary btn-small"
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                    >
                        ← Anterior
                    </button>
                    <button
                        className="btn btn-secondary btn-small"
                        onClick={handleNext}
                        disabled={currentIndex === totalSteps - 1}
                    >
                        Siguiente →
                    </button>
                </div>

                <div className="progress-indicator">
                    Paso {currentIndex + 1} de {totalSteps}
                </div>
            </div>

            <button
                className="btn btn-primary"
                onClick={onReset}
                style={{ marginTop: '1rem' }}
            >
                🔄 Reiniciar
            </button>
        </div>
    );
}

export default StoryReader;
