// ──────────────────────────────────────────────────────────
//  Capa: Presentación
//  Responsabilidad: Mostrar el cuento con navegación
//  progresiva. Recibe todo el estado desde el hook (state/)
//  y solo emite eventos al padre. No mantiene estado propio.
// ──────────────────────────────────────────────────────────

import React from 'react';
import { Story, ReadingMode } from '../types/story';

interface Props {
  story: Story;
  readingMode: ReadingMode;
  currentIndex: number;
  onModeChange: (mode: ReadingMode) => void;
  onNext: () => void;
  onPrevious: () => void;
  onReset: () => void;
}

const BTN_BASE: React.CSSProperties = {
  padding: '13px 28px',
  borderRadius: 14,
  border: 'none',
  fontSize: 18,
  fontWeight: 800,
  cursor: 'pointer',
  transition: 'background 0.2s, opacity 0.2s',
  fontFamily: 'inherit',
};

const StoryReader: React.FC<Props> = ({
  story,
  readingMode,
  currentIndex,
  onModeChange,
  onNext,
  onPrevious,
  onReset,
}) => {
  const items = readingMode === 'frases' ? story.frases : story.parrafos;
  const total = items.length;
  const current = items[currentIndex] ?? '';
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === total - 1;

  return (
    <div
      style={{
        background: 'white',
        borderRadius: 24,
        padding: '32px 28px',
        boxShadow: '0 6px 32px rgba(0,0,0,0.08)',
        border: '3px solid #4D96FF',
      }}
    >
      {/* Título */}
      <h2
        style={{
          fontSize: 28,
          color: '#4D96FF',
          textAlign: 'center',
          marginBottom: 24,
          fontWeight: 900,
          lineHeight: 1.3,
        }}
      >
        📖 {story.titulo}
      </h2>

      {/* Selector de modo */}
      <div
        role="group"
        aria-label="Modo de lectura"
        style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 20 }}
      >
        {(['frases', 'parrafos'] as ReadingMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => onModeChange(mode)}
            aria-pressed={readingMode === mode}
            style={{
              padding: '10px 24px',
              borderRadius: 12,
              border: '2px solid #4D96FF',
              background: readingMode === mode ? '#4D96FF' : 'white',
              color: readingMode === mode ? 'white' : '#4D96FF',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'inherit',
            }}
          >
            {mode === 'frases' ? '📝 Frases' : '📜 Párrafos'}
          </button>
        ))}
      </div>

      {/* Indicador de paso */}
      <div
        aria-live="polite"
        style={{
          textAlign: 'center',
          background: '#FFD93D',
          borderRadius: 12,
          padding: '10px 16px',
          marginBottom: 20,
          fontWeight: 900,
          fontSize: 18,
          color: '#333',
        }}
      >
        Paso {currentIndex + 1} de {total}
      </div>

      {/* Contenido */}
      <div
        style={{
          background: '#F7F8FC',
          borderRadius: 18,
          padding: '28px 24px',
          minHeight: 120,
          fontSize: readingMode === 'frases' ? 22 : 18,
          lineHeight: 1.75,
          color: '#333',
          marginBottom: 28,
          textAlign: readingMode === 'frases' ? 'center' : 'left',
          borderLeft: readingMode === 'parrafos' ? '4px solid #4D96FF' : 'none',
        }}
      >
        {current}
      </div>

      {/* Barra de progreso */}
      <div
        style={{
          background: '#e8edf5',
          borderRadius: 8,
          height: 8,
          marginBottom: 24,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${((currentIndex + 1) / total) * 100}%`,
            background: '#4D96FF',
            height: '100%',
            borderRadius: 8,
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      {/* Botones de navegación */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={onPrevious}
          disabled={isFirst}
          aria-label="Ir al anterior"
          style={{
            ...BTN_BASE,
            background: isFirst ? '#e0e0e0' : '#4D96FF',
            color: isFirst ? '#999' : 'white',
            cursor: isFirst ? 'not-allowed' : 'pointer',
          }}
        >
          ← Anterior
        </button>

        <button
          onClick={onReset}
          aria-label="Reiniciar desde el principio"
          style={{
            ...BTN_BASE,
            background: 'white',
            border: '2px solid #FFD93D',
            color: '#555',
          }}
        >
          🔄 Reiniciar
        </button>

        <button
          onClick={onNext}
          disabled={isLast}
          aria-label="Ir al siguiente"
          style={{
            ...BTN_BASE,
            background: isLast ? '#e0e0e0' : '#4D96FF',
            color: isLast ? '#999' : 'white',
            cursor: isLast ? 'not-allowed' : 'pointer',
          }}
        >
          Siguiente →
        </button>
      </div>

      {isLast && (
        <p
          style={{
            textAlign: 'center',
            marginTop: 20,
            fontSize: 20,
            color: '#FF6B6B',
            fontWeight: 700,
          }}
        >
          🎉 ¡Has terminado el cuento! ¡Muy bien!
        </p>
      )}
    </div>
  );
};

export default StoryReader;
