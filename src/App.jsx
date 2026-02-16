import { useState } from 'react';
import Formulario from './Formulario';
import VistaLectura from './VistaLectura';
import './App.css';

function App() {
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerar = async (datos) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Error al generar el cuento');
      }
      setStory(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReiniciar = () => {
    setStory(null);
    setError(null);
  };

  if (story) {
    return <VistaLectura story={story} onReiniciar={handleReiniciar} />;
  }

  return (
    <div className="app">
      <header className="header">
        <h1>📖 Cuentos Infantiles</h1>
        <p>Lectura progresiva personalizada</p>
      </header>
      <Formulario onSubmit={handleGenerar} loading={loading} error={error} />
    </div>
  );
}

export default App;
