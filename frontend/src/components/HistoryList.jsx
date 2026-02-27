const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return Number.isNaN(date.getTime()) ? isoDate : date.toLocaleString();
};

export const HistoryList = ({ sessions, onOpen, loading }) => {
  return (
    <section className="card">
      <h2 className="section-title">Historial 🕒</h2>
      {loading ? (
        <p className="muted">Cargando historial...</p>
      ) : sessions.length === 0 ? (
        <p className="muted">Todavia no hay cuentos guardados.</p>
      ) : (
        <ul className="history-list">
          {sessions.map((session) => (
            <li key={session.id}>
              <div>
                <strong>{session.titulo}</strong>
                <p>{formatDate(session.fecha)}</p>
              </div>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => onOpen(session.id)}
              >
                Abrir
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
