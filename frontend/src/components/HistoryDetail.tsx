// ──────────────────────────────────────────────────────────
//  Capa: Presentación
//  Responsabilidad: Cargar y mostrar en modo lector un cuento
//  del historial. Gestiona su propio estado de carga/error
//  y navegación de lectura (local a este componente).
// ──────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import { SessionDetail, ReadingMode } from '../types/story';
import { storyApi } from '../services/storyApi';

interface Props {
  sessionId: number;
  onClose: () => void;
}

const BTN_NAV: React.CSSProperties = {
  padding: '12px 24px',
  borderRadius: 13,
  border: 'none',
  fontSize: 17,
  fontWeight: 800,
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'background 0.2s',
};

const HistoryDetail: React.FC<Props> = ({ sessionId, onClose }) => {
  const [session, setSession] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readingMode, setReadingMode] = useState<ReadingMode>('frases');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);
    storyApi
      .getSession(sessionId)
      .then((data) => {
        setSession(data);
        setCurrentIndex(0);
        setReadingMode('frases');
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Error al cargar el cuento');
      })
      .finally(() => setLoading(false));
  }, [sessionId]);

  const handleModeChange = (mode: ReadingMode) => {
    setReadingMode(mode);
    setCurrentIndex(0);
  };

  if (loading) {
    return (
      <div
        style={{
          background: 'white',
          borderRadius: 24,
          padding: 40,
          textAlign: 'center',
          boxShadow: '0 6px 32px rgba(0,0,0,0.08)',
          border: '3px solid #4D96FF',
        }}
      >
        <p style={{ fontSize: 20, color: '#888' }}>⏳ Cargando cuento…</p>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div
        style={{
          background: 'white',
          borderRadius: 24,
          padding: 40,
          textAlign: 'center',
          boxShadow: '0 6px 32px rgba(0,0,0,0.08)',
          border: '3px solid #FF6B6B',
        }}
      >
        <p style={{ fontSize: 18, color: '#FF6B6B', marginBottom: 20 }}>
          ⚠️ {error ?? 'No se encontró el cuento'}
        </p>
        <button
          onClick={onClose}
          style={{
            padding: '10px 24px',
            borderRadius: 12,
            border: 'none',
            background: '#4D96FF',
            color: 'white',
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          ← Volver
        </button>
      </div>
    );
  }

  const items = readingMode === 'frases' ? session.frases : session.parrafos;
  const total = items.length;
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
      {/* Cabecera */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 12,
          marginBottom: 8,
          flexWrap: 'wrap',
        }}
      >
        <h2 style={{ fontSize: 26, color: '#4D96FF', margin: 0, fontWeight: 900, flex: 1 }}>
          📖 {session.titulo}
        </h2>
        <button
          onClick={onClose}
          aria-label="Cerrar detalle"
          style={{
            background: '#FF6B6B',
            color: 'white',
            border: 'none',
            borderRadius: 10,
            padding: '8px 18px',
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
            flexShrink: 0,
          }}
        >
          ✕ Cerrar
        </button>
      </div>

      <p style={{ fontSize: 14, color: '#888', marginBottom: 20, marginTop: 4 }}>
        👦 {session.nombre_nino} · {session.edad} años · 🏷️ {session.tema}
      </p>

      {/* Selector de modo */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
        {(['frases', 'parrafos'] as ReadingMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => handleModeChange(mode)}
            style={{
              padding: '10px 22px',
              borderRadius: 12,
              border: '2px solid #4D96FF',
              background: readingMode === mode ? '#4D96FF' : 'white',
              color: readingMode === mode ? 'white' : '#4D96FF',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {mode === 'frases' ? '📝 Frases' : '📜 Párrafos'}
          </button>
        ))}
      </div>

      {/* Indicador */}
      <div
        aria-live="polite"
        style={{
          textAlign: 'center',
          background: '#FFD93D',
          borderRadius: 12,
          padding: '10px',
          marginBottom: 16,
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
          borderRadius: 16,
          padding: '24px',
          minHeight: 100,
          fontSize: readingMode === 'frases' ? 22 : 18,
          lineHeight: 1.75,
          color: '#333',
          marginBottom: 20,
          textAlign: readingMode === 'frases' ? 'center' : 'left',
          borderLeft: readingMode === 'parrafos' ? '4px solid #4D96FF' : 'none',
        }}
      >
        {items[currentIndex]}
      </div>

      {/* Barra de progreso */}
      <div
        style={{ background: '#e8edf5', borderRadius: 8, height: 8, marginBottom: 20, overflow: 'hidden' }}
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

      {/* Navegación */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
          disabled={isFirst}
          style={{
            ...BTN_NAV,
            background: isFirst ? '#e0e0e0' : '#4D96FF',
            color: isFirst ? '#999' : 'white',
            cursor: isFirst ? 'not-allowed' : 'pointer',
          }}
        >
          ← Anterior
        </button>

        <button
          onClick={() => setCurrentIndex(0)}
          style={{ ...BTN_NAV, background: 'white', border: '2px solid #FFD93D', color: '#555' }}
        >
          🔄 Reiniciar
        </button>

        <button
          onClick={() => setCurrentIndex((i) => Math.min(i + 1, total - 1))}
          disabled={isLast}
          style={{
            ...BTN_NAV,
            background: isLast ? '#e0e0e0' : '#4D96FF',
            color: isLast ? '#999' : 'white',
            cursor: isLast ? 'not-allowed' : 'pointer',
          }}
        >
          Siguiente →
        </button>
      </div>

      {isLast && (
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 20, color: '#FF6B6B', fontWeight: 700 }}>
          🎉 ¡Fin del cuento!
        </p>
      )}
    </div>
  );
};

export default HistoryDetail;
