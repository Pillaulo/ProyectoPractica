import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import type { Profile } from '../api/types';
import Loading from '../components/Loading';
import ErrorBox from '../components/ErrorBox';
import EmptyState from '../components/EmptyState';
import './CrearCuento.css';

const READING_LEVELS = [
  { value: 'inicial', label: 'Inicial (4-5 años)' },
  { value: 'basico', label: 'Básico (6-7 años)' },
  { value: 'intermedio', label: 'Intermedio (8-9 años)' },
  { value: 'avanzado', label: 'Avanzado (10+ años)' },
];

const THEMES = [
  { value: 'animales', label: '🐾 Animales' },
  { value: 'fantasia', label: '✨ Fantasía' },
  { value: 'aventuras', label: '🗺️ Aventuras' },
  { value: 'amistad', label: '💕 Amistad' },
  { value: 'naturaleza', label: '🌿 Naturaleza' },
];

export default function CrearCuento() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formLevel, setFormLevel] = useState('basico');
  const [formThemes, setFormThemes] = useState<string[]>([]);

  useEffect(() => {
    loadProfiles();
  }, []);

  async function loadProfiles() {
    setLoading(true);
    setError(null);
    const { data, error: err } = await api.getProfiles();
    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    setProfiles(data?.profiles ?? []);
    setLoading(false);
  }

  async function handleCreateProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!formName.trim()) return;
    setCreating(true);
    setError(null);
    const { data, error: err } = await api.createProfile({
      name: formName.trim(),
      readingLevel: formLevel,
      themes: formThemes,
    });
    setCreating(false);
    if (err) {
      setError(err.message);
      return;
    }
    if (data) {
      setProfiles((prev) => [...prev, { ...data, themes: data.themes ?? [] }]);
      setShowForm(false);
      setFormName('');
      setFormThemes([]);
    }
  }

  function toggleTheme(t: string) {
    setFormThemes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  }

  async function handleGenerateStory(profileId: string) {
    setGenerating(profileId);
    setError(null);
    const { data, error: err } = await api.createStory(profileId);
    setGenerating(null);
    if (err) {
      setError(err.message);
      return;
    }
    if (data?.id) {
      navigate(`/leer/${data.id}`);
    }
  }

  if (loading) return <Loading />;

  return (
    <div className="crear-cuento">
      <h1>Crear cuento mágico</h1>

      {error && (
        <ErrorBox message={error} onRetry={loadProfiles} />
      )}

      {!showForm && profiles.length === 0 && !error && (
        <EmptyState
          title="Aún no hay lectores"
          description="Crea un perfil para comenzar a generar cuentos personalizados."
        />
      )}

      {!showForm && (
        <button
          type="button"
          className="btn btn-secondary crear-cuento-add"
          onClick={() => setShowForm(true)}
        >
          + Nuevo perfil de lector
        </button>
      )}

      {showForm && (
        <form className="card form-perfil" onSubmit={handleCreateProfile}>
          <h2>Nuevo perfil</h2>
          <label>
            Nombre del lector
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Ej: Luna"
              required
            />
          </label>
          <label>
            Nivel de lectura
            <select
              value={formLevel}
              onChange={(e) => setFormLevel(e.target.value)}
            >
              {READING_LEVELS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </label>
          <div className="themes">
            <span>Temas favoritos</span>
            <div className="themes-grid">
              {THEMES.map((t) => (
                <label key={t.value} className="theme-chip">
                  <input
                    type="checkbox"
                    checked={formThemes.includes(t.value)}
                    onChange={() => toggleTheme(t.value)}
                  />
                  {t.label}
                </label>
              ))}
            </div>
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowForm(false)}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={creating || !formName.trim()}
            >
              {creating ? 'Creando...' : 'Crear perfil'}
            </button>
          </div>
        </form>
      )}

      {profiles.length > 0 && !showForm && (
        <div className="profiles-list">
          <h2>Elegir lector para generar cuento</h2>
          {profiles.map((p) => (
            <div key={p.id} className="card profile-card">
              <div>
                <strong>{p.name}</strong>
                <span className="profile-meta">
                  {READING_LEVELS.find((l) => l.value === p.readingLevel)?.label}
                  {p.themes.length > 0 && ` · ${p.themes.join(', ')}`}
                </span>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                disabled={generating !== null}
                onClick={() => handleGenerateStory(p.id)}
              >
                {generating === p.id ? '⏳ Generando...' : '✨ Generar cuento'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
