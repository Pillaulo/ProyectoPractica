import { useState } from 'react'
import './StoryReader.css'

export default function StoryReader({ cuento, onReset }) {
  const [modo, setModo] = useState('frases') // 'frases' | 'parrafos'
  const [paso, setPaso] = useState(0)

  const items = modo === 'frases' ? cuento.frases : cuento.parrafos
  const total = items.length

  const handleModoChange = (nuevoModo) => {
    setModo(nuevoModo)
    setPaso(0)
  }

  const anterior = () => setPaso((p) => Math.max(0, p - 1))
  const siguiente = () => setPaso((p) => Math.min(total - 1, p + 1))

  return (
    <div className="story-reader">
      {/* Título */}
      <h2 className="story-title">{cuento.titulo}</h2>

      {/* Selector de modo */}
      <div className="mode-selector">
        <button
          className={`mode-btn ${modo === 'frases' ? 'active' : ''}`}
          onClick={() => handleModoChange('frases')}
        >
          Frases
        </button>
        <button
          className={`mode-btn ${modo === 'parrafos' ? 'active' : ''}`}
          onClick={() => handleModoChange('parrafos')}
        >
          Párrafos
        </button>
      </div>

      {/* Contenido de lectura */}
      <div className="reading-area">
        <p className="reading-text">{items[paso]}</p>
      </div>

      {/* Indicador de progreso */}
      <div className="progress-indicator">
        Paso {paso + 1} de {total}
      </div>

      {/* Barra de progreso visual */}
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${((paso + 1) / total) * 100}%` }}
        />
      </div>

      {/* Controles de navegación */}
      <div className="nav-controls">
        <button
          className="btn-nav"
          onClick={anterior}
          disabled={paso === 0}
        >
          Anterior
        </button>

        <button className="btn-reset" onClick={onReset}>
          Reiniciar
        </button>

        <button
          className="btn-nav"
          onClick={siguiente}
          disabled={paso === total - 1}
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}
