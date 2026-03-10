import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import type { Profile, Story } from '../api/types';
import Loading from '../components/Loading';
import ErrorBox from '../components/ErrorBox';
import EmptyState from '../components/EmptyState';
import './Historial.css';

export default function Historial() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [storiesByProfile, setStoriesByProfile] = useState<Record<string, Story[]>>({});
  const [loading, setLoading] = useState(true);
  const [loadingStories, setLoadingStories] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

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
    const list = data?.profiles ?? [];
    setProfiles(list);
    if (list.length > 0 && !selectedProfile) {
      setSelectedProfile(list[0].id);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!selectedProfile) return;
    loadStories(selectedProfile);
  }, [selectedProfile]);

  async function loadStories(profileId: string) {
    setLoadingStories(true);
    const { data, error: err } = await api.getStoriesByProfile(profileId);
    setLoadingStories(false);
    if (err) return;
    setStoriesByProfile((prev) => ({
      ...prev,
      [profileId]: data?.stories ?? [],
    }));
  }

  const stories = selectedProfile ? (storiesByProfile[selectedProfile] ?? []) : [];
  const selectedProfileData = profiles.find((p) => p.id === selectedProfile);

  if (loading) return <Loading />;

  return (
    <div className="historial">
      <h1>Historial de cuentos</h1>

      {error && <ErrorBox message={error} onRetry={loadProfiles} />}

      {profiles.length === 0 && !error && (
        <EmptyState
          title="Aún no hay cuentos"
          description="Crea tu primer cuento en la página principal."
        />
      )}

      {profiles.length > 0 && (
        <>
          <div className="historial-select">
            <label>
              Ver cuentos de:
              <select
                value={selectedProfile ?? ''}
                onChange={(e) => setSelectedProfile(e.target.value || null)}
              >
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {loadingStories && <Loading />}
          {!loadingStories && stories.length === 0 && selectedProfile && (
            <EmptyState
              title={`${selectedProfileData?.name ?? 'Este lector'} no tiene cuentos aún`}
              description="Genera tu primer cuento."
            />
          )}

          {!loadingStories && stories.length > 0 && (
            <ul className="historial-list">
              {stories.map((s) => (
                <li key={s.id} className="card historial-item">
                  <div>
                    <strong>{s.title}</strong>
                    <span className="historial-meta">
                      {s.segmentCount} segmentos ·{' '}
                      {new Date(s.createdAt).toLocaleDateString('es')}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => navigate(`/leer/${s.id}`)}
                  >
                    Leer
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
