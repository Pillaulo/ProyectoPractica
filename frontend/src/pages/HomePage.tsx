/**
 * Página principal - orquesta componentes y lógica
 * Presentación + coordinación con state y services
 */

import { useState, useEffect, useCallback } from 'react';
import { StoryForm } from '../components/StoryForm';
import { ReadingView } from '../components/ReadingView';
import { HistorySection } from '../components/HistorySection';
import { useReadingState } from '../state/useReadingState';
import { generateStory, getSessions, getSessionById } from '../services/storyApi';
import type { StoryRequest, StoryResponse, SessionListItem } from '../services/storyApi';

type ViewMode = 'form' | 'reading' | 'history';

export function HomePage() {
  const [currentStory, setCurrentStory] = useState<StoryResponse | null>(null);
  const [historySession, setHistorySession] = useState<StoryResponse | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('form');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<SessionListItem[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  const displayStory = historySession ?? currentStory;
  const reading = useReadingState(
    displayStory?.frases ?? [],
    displayStory?.parrafos ?? [],
  );

  const loadSessions = useCallback(async () => {
    setSessionsLoading(true);
    try {
      const data = await getSessions();
      setSessions(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar historial');
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  async function handleGenerate(data: StoryRequest) {
    setError(null);
    setIsGenerating(true);
    try {
      const story = await generateStory(data);
      setCurrentStory(story);
      setHistorySession(null);
      setViewMode('reading');
      reading.reiniciar();
      await loadSessions();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al generar cuento');
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSelectHistory(id: number) {
    setError(null);
    setSessionsLoading(true);
    try {
      const session = await getSessionById(id);
      setHistorySession({
        titulo: session.titulo,
        frases: session.frases,
        parrafos: session.parrafos,
      });
      setViewMode('reading');
      reading.reiniciar();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar sesión');
    } finally {
      setSessionsLoading(false);
    }
  }

  function handleBackToForm() {
    setViewMode('form');
    setError(null);
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>📖 Cuentos mágicos</h1>
        <p>Cuentos personalizados para niños de 5 a 9 años</p>
      </header>

      <main className="app-main">
        {viewMode === 'form' && (
          <section className="section-form card">
            <StoryForm
              onSubmit={handleGenerate}
              isLoading={isGenerating}
              error={error}
            />
          </section>
        )}

        {(viewMode === 'reading' || viewMode === 'history') && displayStory && (
          <section className="section-reading">
            <ReadingView
              titulo={displayStory.titulo}
              mode={reading.mode}
              setMode={reading.setMode}
              index={reading.index}
              total={reading.total}
              currentText={reading.items[reading.index] ?? ''}
              canGoPrev={reading.canGoPrev}
              canGoNext={reading.canGoNext}
              onPrev={reading.goPrev}
              onNext={reading.goNext}
              onReiniciar={reading.reiniciar}
            />
            <button
              type="button"
              className="btn btn-primary back-btn"
              onClick={handleBackToForm}
            >
              ← Volver a crear otro cuento
            </button>
          </section>
        )}

        <section className="section-history">
          <HistorySection
            sessions={sessions}
            isLoading={sessionsLoading}
            onSelect={handleSelectHistory}
            onRefresh={loadSessions}
          />
        </section>
      </main>
    </div>
  );
}
