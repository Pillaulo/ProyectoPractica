// ──────────────────────────────────────────────────────────
//  Capa: Presentación
//  Responsabilidad: Mostrar el listado del historial de
//  cuentos generados. Llama al service para obtener datos y
//  emite el id seleccionado al padre.
// ──────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import { SessionSummary } from '../types/story';
import { storyApi } from '../services/storyApi';

interface Props {
  onSelectSession: (id: number) => void;
  refreshTrigger?: number;
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

const HistoryList: React.FC<Props> = ({ onSelectSession, refreshTrigger }) => {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    storyApi
      .getSessions()
      .then(setSessions)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Error al cargar el historial');
      })
      .finally(() => setLoading(false));
  }, [refreshTrigger]);

  return (
    <div
      style={{
        background: 'white',
        borderRadius: 24,
        padding: '28px',
        boxShadow: '0 6px 32px rgba(0,0,0,0.08)',
        border: '3px solid #FFD93D',
      }}
    >
      <h2 style={{ fontSize: 24, color: '#FF6B6B', marginBottom: 16, fontWeight: 900 }}>
        📜 Historial de Cuentos
      </h2>

      {loading && (
        <p style={{ color: '#aaa', textAlign: 'center', fontSize: 16, padding: '16px 0' }}>
          ⏳ Cargando historial…
        </p>
      )}

      {!loading && error && (
        <p style={{ color: '#FF6B6B', fontWeight: 600, fontSize: 15 }}>⚠️ {error}</p>
      )}

      {!loading && !error && sessions.length === 0 && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <p style={{ fontSize: 32 }}>📚</p>
          <p style={{ color: '#aaa', fontSize: 16 }}>
            Aún no hay cuentos guardados. ¡Crea el primero!
          </p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sessions.map((session) => (
          <button
            key={session.id}
            onClick={() => onSelectSession(session.id)}
            style={{
              background: '#F7F8FC',
              border: '2px solid #e0e6f0',
              borderRadius: 14,
              padding: '14px 18px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 0.15s, border-color 0.15s',
              fontFamily: 'inherit',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#eef3ff';
              e.currentTarget.style.borderColor = '#4D96FF';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#F7F8FC';
              e.currentTarget.style.borderColor = '#e0e6f0';
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = '3px solid #4D96FF';
              e.currentTarget.style.outlineOffset = '2px';
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = 'none';
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 16, color: '#333' }}>
              📖 {session.titulo}
            </div>
            <div style={{ fontSize: 14, color: '#666', marginTop: 4 }}>
              👦 {session.nombre_nino} &nbsp;·&nbsp; 🏷️ {session.tema}
            </div>
            <div style={{ fontSize: 13, color: '#aaa', marginTop: 3 }}>
              🕐 {formatDate(session.created_at)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;
