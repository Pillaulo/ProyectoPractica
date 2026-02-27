import React, { useState } from 'react';
import { StoryForm } from './components/StoryForm';
import { ReadingView } from './components/ReadingView';
import { HistoryList } from './components/HistoryList';
import { useStoryGeneration } from './state/useStoryGeneration';

function App() {
  const { loading, error, story, generate, reset, loadStory } = useStoryGeneration();
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="container">
      <header className="mb-4 text-center">
        <h1 style={{ fontSize: '42px', marginBottom: '8px' }}>Cuentos Mágicos 📖</h1>
        <p style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Aprende a leer con historias hechas solo para ti</p>
      </header>

      {error && (
        <div className="card" style={{ border: '2px solid var(--primary)' }}>
          <h3 style={{ color: 'var(--primary)', margin: 0 }}>Error ❌</h3>
          <p>{error}</p>
        </div>
      )}

      {!story ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 style={{ margin: 0 }}>Generador de Cuentos</h2>
            <button
              className="btn-outline"
              onClick={() => setShowHistory(!showHistory)}
              style={{ fontSize: '14px', padding: '8px 16px' }}
            >
              {showHistory ? 'Ocultar Historial' : 'Ver Historial'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: showHistory ? '1fr 1fr' : '1fr', gap: '24px' }}>
            <div>
              <StoryForm onGenerate={generate} loading={loading} />
            </div>
            {showHistory && (
              <div>
                <HistoryList onSelectStory={loadStory} />
              </div>
            )}
          </div>
        </>
      ) : (
        <ReadingView story={story} onRestart={reset} />
      )}
    </div>
  );
}

export default App;
