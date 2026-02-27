// ──────────────────────────────────────────────────────────
//  Capa: Presentación – Página principal
//  Responsabilidad: Componer los componentes y conectar el
//  hook useStory con la vista. Gestiona qué sección mostrar.
// ──────────────────────────────────────────────────────────

import React, { useState, useCallback } from 'react';
import StoryForm from '../components/StoryForm';
import StoryReader from '../components/StoryReader';
import HistoryList from '../components/HistoryList';
import HistoryDetail from '../components/HistoryDetail';
import ErrorMessage from '../components/ErrorMessage';
import { useStory } from '../state/useStory';
import { StoryFormData } from '../types/story';

const HomePage: React.FC = () => {
  const {
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
  } = useStory();

  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [historyRefresh, setHistoryRefresh] = useState(0);

  const handleGenerate = useCallback(
    async (formData: StoryFormData) => {
      await generate(formData);
      setHistoryRefresh((n) => n + 1);
    },
    [generate],
  );

  const handleSelectSession = (id: number) => {
    setSelectedSessionId(id);
  };

  const handleCloseSession = () => {
    setSelectedSessionId(null);
  };

  const handleNewStory = () => {
    clearStory();
    setSelectedSessionId(null);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F7F8FC', padding: '24px 16px' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>

        {/* ── Header ── */}
        <header style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 44,
              color: '#FF6B6B',
              fontWeight: 900,
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            📚 CuentoMágico
          </h1>
          <p style={{ fontSize: 18, color: '#777', marginTop: 8, fontWeight: 500 }}>
            ¡Cuentos personalizados para pequeños lectores! 🌟
          </p>
        </header>

        {/* ── Error global ── */}
        {error && <ErrorMessage message={error} onClose={clearError} />}

        {/* ── Vista: Detalle de sesión del historial ── */}
        {selectedSessionId !== null && (
          <div style={{ marginBottom: 24 }}>
            <HistoryDetail sessionId={selectedSessionId} onClose={handleCloseSession} />
          </div>
        )}

        {/* ── Vista: Lector del cuento recién generado ── */}
        {selectedSessionId === null && story && (
          <div style={{ marginBottom: 24 }}>
            <StoryReader
              story={story}
              readingMode={readingMode}
              currentIndex={currentIndex}
              onModeChange={setReadingMode}
              onNext={next}
              onPrevious={previous}
              onReset={reset}
            />
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <button
                onClick={handleNewStory}
                style={{
                  padding: '12px 28px',
                  borderRadius: 14,
                  border: '2px solid #FF6B6B',
                  background: 'white',
                  color: '#FF6B6B',
                  fontSize: 17,
                  fontWeight: 800,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'background 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#fff0f0';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'white';
                }}
              >
                ✏️ Crear nuevo cuento
              </button>
            </div>
          </div>
        )}

        {/* ── Vista: Formulario (cuando no hay cuento activo) ── */}
        {selectedSessionId === null && !story && (
          <div style={{ marginBottom: 24 }}>
            <StoryForm onSubmit={handleGenerate} loading={loading} />
          </div>
        )}

        {/* ── Historial (siempre visible, salvo cuando hay un detalle abierto) ── */}
        {selectedSessionId === null && (
          <HistoryList
            onSelectSession={handleSelectSession}
            refreshTrigger={historyRefresh}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
