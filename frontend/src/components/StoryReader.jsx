import { useStoryReader } from '../hooks/useStoryReader';

export function StoryReader({ story, onBack }) {
  const {
    mode,
    changeMode,
    index,
    total,
    currentItem,
    goNext,
    goPrev,
    reset,
    isFirst,
    isLast,
  } = useStoryReader(story);

  return (
    <div className="story-reader">
      <h2 className="story-title">📖 {story.titulo}</h2>

      <div className="mode-selector">
        <button
          className={`btn btn-mode ${mode === 'frases' ? 'active' : ''}`}
          onClick={() => changeMode('frases')}
        >
          Frases
        </button>
        <button
          className={`btn btn-mode ${mode === 'parrafos' ? 'active' : ''}`}
          onClick={() => changeMode('parrafos')}
        >
          Párrafos
        </button>
      </div>

      <div className="reading-card">
        <p className="reading-text">{currentItem}</p>
      </div>

      <div className="reading-indicator">
        Paso {index + 1} de {total}
      </div>

      <div className="reading-controls">
        <button className="btn btn-secondary" onClick={goPrev} disabled={isFirst}>
          ⬅ Anterior
        </button>
        <button className="btn btn-accent" onClick={reset}>
          🔄 Reiniciar
        </button>
        <button className="btn btn-secondary" onClick={goNext} disabled={isLast}>
          Siguiente ➡
        </button>
      </div>

      <button className="btn btn-back" onClick={onBack}>
        ← Volver al inicio
      </button>
    </div>
  );
}
