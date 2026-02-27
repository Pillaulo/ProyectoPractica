import { StoryForm } from './components/StoryForm';
import { StoryReader } from './components/StoryReader';
import { StoryHistory } from './components/StoryHistory';
import { ErrorMessage } from './components/ErrorMessage';
import { useStoryGenerator } from './hooks/useStoryGenerator';

function App() {
  const { story, loading, error, generate, clearStory, setStory } =
    useStoryGenerator();

  return (
    <div className="app">
      <header className="app-header">
        <h1>📖 Cuentos Mágicos</h1>
        <p className="subtitle">¡Crea historias increíbles para leer y aprender!</p>
      </header>

      <main className="app-main">
        {story ? (
          <StoryReader story={story} onBack={clearStory} />
        ) : (
          <div className="home-layout">
            <section className="form-section">
              <ErrorMessage message={error} />
              <StoryForm onSubmit={generate} loading={loading} />
            </section>
            <section className="history-section-wrapper">
              <StoryHistory onSelectStory={setStory} />
            </section>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Hecho con ❤️ para pequeños lectores</p>
      </footer>
    </div>
  );
}

export default App;
