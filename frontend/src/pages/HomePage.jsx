import { useEffect, useState } from "react";
import { StoryForm } from "../components/StoryForm";
import { ReadingViewer } from "../components/ReadingViewer";
import { HistoryList } from "../components/HistoryList";
import { createStory, fetchSessionById, fetchSessions } from "../services/storyApi";

export const HomePage = () => {
  const [story, setStory] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loadingStory, setLoadingStory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await fetchSessions();
      setSessions(Array.isArray(data) ? data : []);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleGenerate = async (payload) => {
    setLoadingStory(true);
    setErrorMessage("");

    try {
      const createdStory = await createStory(payload);
      setStory(createdStory);
      await loadHistory();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoadingStory(false);
    }
  };

  const handleOpenSession = async (sessionId) => {
    setErrorMessage("");
    try {
      const session = await fetchSessionById(sessionId);
      setStory({
        titulo: session.titulo,
        frases: session.frases,
        parrafos: session.parrafos,
      });
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <main className="page">
      <header className="hero card">
        <h1>Cuentos Magicos para Ninos</h1>
        <p>Personaliza una historia y leela paso a paso.</p>
      </header>

      {errorMessage ? <p className="error-box">{errorMessage}</p> : null}

      <div className="layout-grid">
        <StoryForm onSubmit={handleGenerate} loading={loadingStory} />
        <ReadingViewer story={story} />
      </div>

      <HistoryList sessions={sessions} onOpen={handleOpenSession} loading={loadingHistory} />
    </main>
  );
};
