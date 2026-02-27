/**
 * Presentación: vista de lectura progresiva
 * Solo UI y eventos - el estado de lectura viene del hook
 */

import type { ReadingMode } from '../state/useReadingState';

interface ReadingViewProps {
  titulo: string;
  mode: ReadingMode;
  setMode: (m: ReadingMode) => void;
  index: number;
  total: number;
  currentText: string;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onReiniciar: () => void;
}

export function ReadingView({
  titulo,
  mode,
  setMode,
  index,
  total,
  currentText,
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
  onReiniciar,
}: ReadingViewProps) {
  return (
    <div className="reading-view card">
      <h2>{titulo}</h2>
      <div className="reading-controls">
        <label>
          <input
            type="radio"
            name="mode"
            checked={mode === 'frases'}
            onChange={() => setMode('frases')}
          />
          Frases
        </label>
        <label>
          <input
            type="radio"
            name="mode"
            checked={mode === 'parrafos'}
            onChange={() => setMode('parrafos')}
          />
          Párrafos
        </label>
      </div>
      <p className="step-indicator">Paso {index + 1} de {total}</p>
      <div className="reading-text">{currentText}</div>
      <div className="reading-buttons">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onPrev}
          disabled={!canGoPrev}
        >
          ← Anterior
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onNext}
          disabled={!canGoNext}
        >
          Siguiente →
        </button>
      </div>
      <button type="button" className="btn btn-accent" onClick={onReiniciar}>
        🔄 Reiniciar
      </button>
    </div>
  );
}
