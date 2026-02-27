import { useState, useEffect } from 'react';
import { getSessions, getSessionById } from '../services/storyApi';

export function StoryHistory({ onSelectStory }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    setLoading(true);
    setError(null);
    try {
      const data = await getSessions();
      setSessions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSelect(id) {
    try {
      const detail = await getSessionById(id);
      onSelectStory({
        titulo: detail.titulo,
        frases: detail.frases,
        parrafos: detail.parrafos,
      });
    } catch (err) {
      setError(err.message);
    }
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr + 'Z');
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div className="history-section">
      <h2>📚 Historial de cuentos</h2>

      <button className="btn btn-secondary btn-refresh" onClick={loadSessions}>
        🔄 Actualizar
      </button>

      {loading && <p className="loading-text">Cargando historial...</p>}
      {error && <p className="error-text">Error: {error}</p>}

      {!loading && sessions.length === 0 && (
        <p className="empty-text">Aún no hay cuentos guardados. ¡Crea el primero!</p>
      )}

      <div className="history-list">
        {sessions.map((session) => (
          <button
            key={session.id}
            className="history-card"
            onClick={() => handleSelect(session.id)}
          >
            <span className="history-title">{session.titulo}</span>
            <span className="history-meta">
              {session.nombre_nino} · {session.tema}
            </span>
            <span className="history-date">{formatDate(session.created_at)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
