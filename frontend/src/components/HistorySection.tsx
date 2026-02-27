/**
 * Presentación: historial de cuentos
 * Solo UI y eventos - los datos y acciones vienen por props
 */

import type { SessionListItem } from '../services/storyApi';

interface HistorySectionProps {
  sessions: SessionListItem[];
  isLoading: boolean;
  onSelect: (id: number) => void;
  onRefresh: () => void;
}

export function HistorySection({ sessions, isLoading, onSelect, onRefresh }: HistorySectionProps) {
  return (
    <div className="history-section card">
      <h2>📚 Historial</h2>
      <button type="button" className="btn btn-accent btn-sm" onClick={onRefresh}>
        🔃 Actualizar
      </button>
      {isLoading ? (
        <p>Cargando historial...</p>
      ) : sessions.length === 0 ? (
        <p>Aún no hay cuentos en el historial.</p>
      ) : (
        <ul className="history-list">
          {sessions.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                className="history-item"
                onClick={() => onSelect(s.id)}
              >
                <span className="history-title">{s.titulo}</span>
                <span className="history-meta">{s.fecha}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
