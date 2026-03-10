import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import type { Segment } from '../api/types';
import Loading from '../components/Loading';
import ErrorBox from '../components/ErrorBox';
import './LecturaProgresiva.css';

export default function LecturaProgresiva() {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const [segments, setSegments] = useState<Segment[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!storyId) {
      setError('Cuento no encontrado');
      setLoading(false);
      return;
    }
    loadStory();
  }, [storyId]);

  async function loadStory() {
    if (!storyId) return;
    setLoading(true);
    setError(null);
    const [storyRes, segmentsRes] = await Promise.all([
      api.getStory(storyId),
      api.getStorySegments(storyId),
    ]);
    if (storyRes.error || segmentsRes.error) {
      setError(storyRes.error?.message ?? segmentsRes.error?.message ?? 'Error al cargar');
      setLoading(false);
      return;
    }
    if (storyRes.data) setTitle(storyRes.data.title);
    if (segmentsRes.data) setSegments(segmentsRes.data.segments ?? []);
    setLoading(false);
  }

  const currentSegment = segments[currentIndex];
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < segments.length - 1;

  function goPrev() {
    if (canGoPrev) setCurrentIndex((i) => i - 1);
  }

  function goNext() {
    if (canGoNext) setCurrentIndex((i) => i + 1);
  }

  if (loading) return <Loading />;
  if (error) return <ErrorBox message={error} onRetry={loadStory} />;
  if (segments.length === 0) {
    return (
      <ErrorBox
        message="Este cuento no tiene segmentos."
        onRetry={() => navigate('/')}
      />
    );
  }

  return (
    <div className="lectura-progresiva">
      <div className="lectura-header">
        <button
          type="button"
          className="btn-back"
          onClick={() => navigate('/')}
          aria-label="Volver"
        >
          ← Volver
        </button>
        <h1 className="lectura-title">{title}</h1>
        <span className="lectura-progress">
          {currentIndex + 1} / {segments.length}
        </span>
      </div>

      <div className="segment-container">
        <p className="segment-text">{currentSegment.text}</p>
      </div>

      <div className="lectura-controls">
        <button
          type="button"
          className="btn btn-secondary"
          disabled={!canGoPrev}
          onClick={goPrev}
        >
          ← Anterior
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={!canGoNext}
          onClick={goNext}
        >
          {canGoNext ? 'Siguiente →' : '¡Fin!'}
        </button>
      </div>
    </div>
  );
}
