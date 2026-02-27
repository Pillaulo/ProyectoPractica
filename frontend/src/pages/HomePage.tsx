import { useEffect, useMemo, useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { SegmentedControl } from '../components/SegmentedControl';
import { storyApi } from '../services/storyApi';
import type { SessionDetail, SessionListItem, StoryRequest, StoryResponse, VocabularyLevel } from '../types/story';
import { ApiError } from '../services/apiClient';
import { useReadingState } from '../state/useReadingState';

type CurrentStory = {
  titulo: string;
  frases: string[];
  parrafos: string[];
};

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

export function HomePage() {
  const [form, setForm] = useState<StoryRequest>({
    nombre_nino: '',
    edad: 7,
    tema: '',
    personaje_principal: '',
    vocabulario: 'simple',
  });

  const [current, setCurrent] = useState<CurrentStory | null>(null);
  const [loadingStory, setLoadingStory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [history, setHistory] = useState<SessionListItem[]>([]);
  const [error, setError] = useState<string>('');

  const frases = useMemo(() => current?.frases ?? [], [current]);
  const parrafos = useMemo(() => current?.parrafos ?? [], [current]);
  const reading = useReadingState(frases, parrafos);

  async function refreshHistory() {
    setLoadingHistory(true);
    setError('');
    try {
      const items = await storyApi.listSessions();
      setHistory(items);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'No se pudo cargar el historial.';
      setError(msg);
    } finally {
      setLoadingHistory(false);
    }
  }

  useEffect(() => {
    void refreshHistory();
  }, []);

  async function onGenerate() {
    setLoadingStory(true);
    setError('');
    try {
      const story: StoryResponse = await storyApi.createStory(form);
      setCurrent(story);
      await refreshHistory();
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'No se pudo generar el cuento.';
      setError(msg);
    } finally {
      setLoadingStory(false);
    }
  }

  async function openSession(id: number) {
    setError('');
    try {
      const session: SessionDetail = await storyApi.getSession(id);
      setCurrent({
        titulo: session.titulo,
        frases: session.frases,
        parrafos: session.parrafos,
      });
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'No se pudo abrir la sesión.';
      setError(msg);
    }
  }

  const stepText = reading.total === 0 ? 'Paso 0 de 0' : `Paso ${reading.index + 1} de ${reading.total}`;

  return (
    <main className="app">
      <header className="header">
        <div className="brand">
          <h1 className="title">Cuentos mágicos 📚✨</h1>
          <p className="subtitle">Elige un tema y lee paso a paso: frases o párrafos.</p>
        </div>
        <div className="badge" aria-label="Edad recomendada">
          🧒 5–9
        </div>
      </header>

      {error ? <div className="errorBox" role="alert">{error}</div> : null}

      <div className="grid" style={{ marginTop: error ? 12 : 0 }}>
        <div className="gridLeft">
          <Card title="Crear tu cuento 🎨">
            <form
              className="form"
              onSubmit={(e) => {
                e.preventDefault();
                void onGenerate();
              }}
            >
              <div className="fieldGrid">
                <div className="field">
                  <label className="label" htmlFor="nombre_nino">Nombre del niño</label>
                  <input
                    id="nombre_nino"
                    className="input"
                    value={form.nombre_nino}
                    onChange={(e) => setForm((f) => ({ ...f, nombre_nino: e.target.value }))}
                    placeholder="Ej: Luna"
                    required
                  />
                </div>
                <div className="field">
                  <label className="label" htmlFor="edad">Edad</label>
                  <select
                    id="edad"
                    className="select"
                    value={form.edad}
                    onChange={(e) => setForm((f) => ({ ...f, edad: Number(e.target.value) }))}
                  >
                    {Array.from({ length: 5 }, (_, i) => 5 + i).map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="fieldGrid">
                <div className="field">
                  <label className="label" htmlFor="tema">Tema</label>
                  <input
                    id="tema"
                    className="input"
                    value={form.tema}
                    onChange={(e) => setForm((f) => ({ ...f, tema: e.target.value }))}
                    placeholder="Ej: amistad"
                    required
                  />
                </div>
                <div className="field">
                  <label className="label" htmlFor="personaje_principal">Personaje principal</label>
                  <input
                    id="personaje_principal"
                    className="input"
                    value={form.personaje_principal}
                    onChange={(e) => setForm((f) => ({ ...f, personaje_principal: e.target.value }))}
                    placeholder="Ej: un dragón tímido"
                    required
                  />
                </div>
              </div>

              <div className="field">
                <span className="label">Vocabulario</span>
                <div className="radioRow" role="radiogroup" aria-label="Nivel de vocabulario">
                  {([
                    { value: 'simple', label: 'Simple 😊' },
                    { value: 'medio', label: 'Medio 🧠' },
                  ] as const).map((opt) => (
                    <label key={opt.value} className="radioPill">
                      <input
                        type="radio"
                        name="vocabulario"
                        value={opt.value}
                        checked={form.vocabulario === opt.value}
                        onChange={() => setForm((f) => ({ ...f, vocabulario: opt.value as VocabularyLevel }))}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="actions">
                <Button type="submit" disabled={loadingStory}>
                  {loadingStory ? 'Generando...' : 'Generar cuento'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    setForm({
                      nombre_nino: '',
                      edad: 7,
                      tema: '',
                      personaje_principal: '',
                      vocabulario: 'simple',
                    })
                  }
                  disabled={loadingStory}
                >
                  Limpiar
                </Button>
              </div>
            </form>
          </Card>

          <div style={{ height: 16 }} />

          <Card title="Lectura progresiva 🪄" right={current ? <span className="badge">📖 {current.titulo}</span> : undefined}>
            <div className="readingModeRow">
              <SegmentedControl
                value={reading.mode}
                onChange={reading.setMode}
                ariaLabel="Modo de lectura"
                options={[
                  { value: 'frases', label: 'Frases' },
                  { value: 'parrafos', label: 'Párrafos' },
                ]}
              />
              <div className="step" aria-label="Indicador de paso">{stepText}</div>
            </div>

            <p className="readingText" aria-live="polite">
              {current ? reading.item : 'Genera un cuento o abre uno del historial para comenzar.'}
            </p>

            <div className="readingFooter">
              <div className="actions" style={{ marginTop: 0 }}>
                <Button type="button" variant="secondary" onClick={reading.prev} disabled={!current || !reading.canPrev}>
                  ⬅️ Anterior
                </Button>
                <Button type="button" variant="secondary" onClick={reading.next} disabled={!current || !reading.canNext}>
                  Siguiente ➡️
                </Button>
                <Button type="button" onClick={reading.reset} disabled={!current}>
                  🔁 Reiniciar
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="gridRight">
          <Card title="Historial 🗂️" right={loadingHistory ? <span className="badge">Cargando...</span> : undefined}>
            {history.length === 0 ? (
              <p className="subtitle" style={{ margin: 0 }}>
                Aún no hay cuentos guardados. ¡Genera el primero!
              </p>
            ) : (
              <div className="historyList" aria-label="Lista de sesiones">
                {history.map((h) => (
                  <div key={h.id} className="historyItem">
                    <div className="historyTitleRow">
                      <p className="historyTitle">📗 {h.titulo}</p>
                      <button className="linkButton" type="button" onClick={() => void openSession(h.id)}>
                        Abrir
                      </button>
                    </div>
                    <p className="historyMeta">
                      {formatDate(h.created_at)} · {h.nombre_nino} · {h.tema}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}

