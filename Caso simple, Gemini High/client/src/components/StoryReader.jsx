import { useState, useEffect } from 'react';

const StoryReader = ({ story, onRestart }) => {
    const [mode, setMode] = useState('frases'); // 'frases' | 'parrafos'
    const [step, setStep] = useState(0);

    const content = mode === 'frases' ? story.frases : story.parrafos;
    const totalSteps = content.length;

    // Reset step when mode changes to avoid out-of-bounds
    useEffect(() => {
        setStep(0);
    }, [mode]);

    const handleNext = () => {
        if (step < totalSteps - 1) setStep(step + 1);
    };

    const handlePrev = () => {
        if (step > 0) setStep(step - 1);
    };

    const progress = ((step + 1) / totalSteps) * 100;

    return (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto', minHeight: '60vh', display: 'flex', flexDirection: 'column' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--primary)' }}>{story.titulo}</h2>

                <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--surface)', padding: '0.25rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
                    <button
                        onClick={() => setMode('frases')}
                        className={mode === 'frases' ? 'btn-primary' : 'btn-secondary'}
                        style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}
                    >
                        Frases
                    </button>
                    <button
                        onClick={() => setMode('parrafos')}
                        className={mode === 'parrafos' ? 'btn-primary' : 'btn-secondary'}
                        style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}
                    >
                        Párrafos
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '2rem 0', position: 'relative' }}>
                <p style={{
                    fontSize: mode === 'frases' ? '1.8rem' : '1.2rem',
                    textAlign: 'center',
                    lineHeight: 1.6,
                    animation: 'fadeIn 0.5s ease'
                }} key={`${mode}-${step}`}>
                    {content[step]}
                </p>
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', height: '6px', background: 'var(--border)', borderRadius: '3px', marginBottom: '1.5rem', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.3s ease' }} />
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Paso {step + 1} de {totalSteps}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={handlePrev}
                        disabled={step === 0}
                        className="btn-secondary"
                        style={{ minWidth: '100px' }}
                    >
                        ← Anterior
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={step === totalSteps - 1}
                        className="btn-primary"
                        style={{ minWidth: '100px' }}
                    >
                        Siguiente →
                    </button>
                </div>
            </div>

            {/* Footer Actions */}
            <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1rem', textAlign: 'center' }}>
                <button
                    onClick={onRestart}
                    style={{ background: 'transparent', color: 'var(--text-muted)', textDecoration: 'underline', border: 'none' }}
                >
                    Crear otro cuento
                </button>
            </div>

        </div>
    );
};

export default StoryReader;
