import { useState } from 'react';

function VistaLectura({ story, onReiniciar }) {
  const [modo, setModo] = useState('frases'); // 'frases' | 'parrafos'
  const [paso, setPaso] = useState(1);

  const items = modo === 'frases' ? story.frases : story.parrafos;
  const total = items.length;
  const actual = Math.min(Math.max(1, paso), total);
  const contenido = items[actual - 1] || '';

  const anterior = () => setPaso((p) => Math.max(1, p - 1));
  const siguiente = () => setPaso((p) => Math.min(total, p + 1));

  return (
    <div className="vista-lectura">
      <header className="header-lectura">
        <h1>{story.titulo}</h1>
        <button className="btn-reiniciar" onClick={onReiniciar}>
          Reiniciar
        </button>
      </header>

      <div className="selector-modo">
        <button
          className={`modo-btn ${modo === 'frases' ? 'activo' : ''}`}
          onClick={() => { setModo('frases'); setPaso(1); }}
        >
          Frases
        </button>
        <button
          className={`modo-btn ${modo === 'parrafos' ? 'activo' : ''}`}
          onClick={() => { setModo('parrafos'); setPaso(1); }}
        >
          Párrafos
        </button>
      </div>

      <p className="indicador-paso">Paso {actual} de {total}</p>

      <div className="contenido-lectura">
        <p>{contenido}</p>
      </div>

      <div className="navegacion">
        <button
          className="btn-nav"
          onClick={anterior}
          disabled={actual <= 1}
          aria-label="Anterior"
        >
          ← Anterior
        </button>
        <button
          className="btn-nav"
          onClick={siguiente}
          disabled={actual >= total}
          aria-label="Siguiente"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}

export default VistaLectura;
