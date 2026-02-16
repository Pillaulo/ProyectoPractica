import React, { useMemo, useState } from 'react';

const initialForm = {
  nombre_nino: '',
  edad: 7,
  tema: '',
  personaje_principal: '',
  vocabulario: 'simple'
};

function nonEmpty(s) {
  return typeof s === 'string' && s.trim().length > 0;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function Stepper({ mode, steps, index, onPrev, onNext, onReset }) {
  const total = steps.length;
  const canPrev = index > 0;
  const canNext = index < total - 1;

  return (
    <div className="card">
      <div className="row between wrap gap">
        <div className="row gap wrap">
          <span className="pill">
            Modo: <strong>{mode === 'frases' ? 'Frases' : 'Párrafos'}</strong>
          </span>
          <span className="pill">
            Paso <strong>{total === 0 ? 0 : index + 1}</strong> de{' '}
            <strong>{total}</strong>
          </span>
        </div>
        <div className="row gap wrap">
          <button className="btn" onClick={onPrev} disabled={!canPrev}>
            Anterior
          </button>
          <button className="btn" onClick={onNext} disabled={!canNext}>
            Siguiente
          </button>
          <button className="btn secondary" onClick={onReset} disabled={total === 0}>
            Reiniciar
          </button>
        </div>
      </div>
      <div className="reading">
        {total === 0 ? (
          <div className="muted">No hay contenido para mostrar.</div>
        ) : (
          <div className="readingText">{steps[index]}</div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [story, setStory] = useState(null); // {titulo, frases, parrafos}
  const [mode, setMode] = useState('frases'); // 'frases' | 'parrafos'
  const [stepIndex, setStepIndex] = useState(0);

  const steps = useMemo(() => {
    if (!story) return [];
    return mode === 'frases' ? story.frases : story.parrafos;
  }, [story, mode]);

  function resetReader() {
    setStepIndex(0);
  }

  function prev() {
    setStepIndex((i) => Math.max(0, i - 1));
  }

  function next() {
    setStepIndex((i) => Math.min(steps.length - 1, i + 1));
  }

  async function onGenerate(e) {
    e.preventDefault();
    setError('');

    const edadNum = clamp(Number(form.edad), 5, 9);
    const clientErrors = [];
    if (!nonEmpty(form.nombre_nino)) clientErrors.push('Completa "nombre_nino".');
    if (!Number.isInteger(edadNum) || edadNum < 5 || edadNum > 9)
      clientErrors.push('La edad debe ser un entero entre 5 y 9.');
    if (!nonEmpty(form.tema)) clientErrors.push('Completa "tema".');
    if (!nonEmpty(form.personaje_principal))
      clientErrors.push('Completa "personaje_principal".');
    if (form.vocabulario !== 'simple' && form.vocabulario !== 'medio')
      clientErrors.push('El vocabulario debe ser "simple" o "medio".');

    if (clientErrors.length) {
      setError(clientErrors.join(' '));
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch('/api/story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          edad: edadNum
        })
      });

      const data = await resp.json().catch(() => null);

      if (!resp.ok) {
        const msg =
          data?.error?.message ||
          `Error del backend (HTTP ${resp.status}).`;
        const details = data?.error?.details;
        setError(details ? `${msg} (${JSON.stringify(details)})` : msg);
        setStory(null);
        return;
      }

      setStory(data);
      setMode('frases');
      setStepIndex(0);
    } catch (err) {
      setError(
        'No se pudo conectar con el backend. ¿Está corriendo en http://localhost:8787?'
      );
      setStory(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1>Cuentos personalizados</h1>
          <p className="sub">
            Generación de cuento + lectura progresiva (sin persistencia).
          </p>
        </div>
        <div className="muted small">
          Estado en memoria: al recargar, se pierde.
        </div>
      </header>

      <div className="grid">
        <section className="card">
          <h2>1) Datos del cuento</h2>
          <form onSubmit={onGenerate} className="form">
            <div className="field">
              <label>nombre_nino</label>
              <input
                value={form.nombre_nino}
                onChange={(e) => setForm((f) => ({ ...f, nombre_nino: e.target.value }))}
                placeholder="Ej: Sofía"
                autoComplete="off"
              />
            </div>

            <div className="field">
              <label>edad (5–9)</label>
              <input
                type="number"
                min={5}
                max={9}
                value={form.edad}
                onChange={(e) =>
                  setForm((f) => ({ ...f, edad: Number(e.target.value) }))
                }
              />
            </div>

            <div className="field">
              <label>tema</label>
              <input
                value={form.tema}
                onChange={(e) => setForm((f) => ({ ...f, tema: e.target.value }))}
                placeholder="Ej: amistad en la escuela"
                autoComplete="off"
              />
            </div>

            <div className="field">
              <label>personaje_principal</label>
              <input
                value={form.personaje_principal}
                onChange={(e) =>
                  setForm((f) => ({ ...f, personaje_principal: e.target.value }))
                }
                placeholder="Ej: un zorro curioso"
                autoComplete="off"
              />
            </div>

            <div className="field">
              <label>vocabulario</label>
              <select
                value={form.vocabulario}
                onChange={(e) => setForm((f) => ({ ...f, vocabulario: e.target.value }))}
              >
                <option value="simple">simple</option>
                <option value="medio">medio</option>
              </select>
            </div>

            <div className="row gap">
              <button className="btn primary" type="submit" disabled={loading}>
                {loading ? 'Generando…' : 'Generar cuento'}
              </button>
              <button
                className="btn secondary"
                type="button"
                onClick={() => {
                  setForm(initialForm);
                  setError('');
                  setStory(null);
                  setMode('frases');
                  setStepIndex(0);
                }}
                disabled={loading}
              >
                Limpiar
              </button>
            </div>

            {error ? <div className="error">{error}</div> : null}
          </form>
        </section>

        <section className="card">
          <h2>2) Lectura progresiva</h2>
          {!story ? (
            <div className="muted">
              Genera un cuento para empezar a leer.
            </div>
          ) : (
            <>
              <div className="row between wrap gap">
                <div>
                  <div className="muted small">Título</div>
                  <div className="title">{story.titulo}</div>
                </div>

                <div className="row gap wrap">
                  <div className="segmented" role="group" aria-label="Modo de lectura">
                    <button
                      type="button"
                      className={mode === 'frases' ? 'seg active' : 'seg'}
                      onClick={() => {
                        setMode('frases');
                        setStepIndex(0);
                      }}
                    >
                      Frases
                    </button>
                    <button
                      type="button"
                      className={mode === 'parrafos' ? 'seg active' : 'seg'}
                      onClick={() => {
                        setMode('parrafos');
                        setStepIndex(0);
                      }}
                    >
                      Párrafos
                    </button>
                  </div>
                </div>
              </div>

              <div className="spacer" />
              <Stepper
                mode={mode}
                steps={steps}
                index={stepIndex}
                onPrev={prev}
                onNext={next}
                onReset={resetReader}
              />
            </>
          )}
        </section>
      </div>

      <footer className="footer muted small">
        Backend: <code>POST /api/story</code> (proxy Groq). Sin base de datos, sin sesiones.
      </footer>
    </div>
  );
}

