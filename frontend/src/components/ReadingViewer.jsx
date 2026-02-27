import { useReadingSession } from "../state/useReadingSession";

export const ReadingViewer = ({ story }) => {
  const { mode, setMode, index, total, currentStep, goPrev, goNext, reset } =
    useReadingSession(story);

  if (!story) {
    return (
      <section className="card">
        <h2 className="section-title">Lectura progresiva 📖</h2>
        <p className="muted">Genera un cuento o abre uno del historial para empezar.</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h2 className="section-title">{story.titulo}</h2>

      <div className="mode-switch">
        <span>Modo:</span>
        <button
          className={`btn ${mode === "frases" ? "btn-secondary" : "btn-ghost"}`}
          onClick={() => setMode("frases")}
          type="button"
        >
          Frases
        </button>
        <button
          className={`btn ${mode === "parrafos" ? "btn-secondary" : "btn-ghost"}`}
          onClick={() => setMode("parrafos")}
          type="button"
        >
          Parrafos
        </button>
      </div>

      <p className="step-indicator">Paso {index + 1} de {total}</p>
      <div className="reading-box">{currentStep}</div>

      <div className="actions-row">
        <button className="btn btn-ghost" type="button" onClick={goPrev} disabled={index === 0}>
          Anterior
        </button>
        <button
          className="btn btn-ghost"
          type="button"
          onClick={goNext}
          disabled={index >= total - 1}
        >
          Siguiente
        </button>
        <button className="btn btn-accent" type="button" onClick={reset}>
          Reiniciar
        </button>
      </div>
    </section>
  );
};
