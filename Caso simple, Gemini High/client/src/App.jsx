import { useState } from 'react';
import StoryForm from './components/StoryForm';
import StoryReader from './components/StoryReader';

function App() {
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchStory = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/story', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Error al generar el cuento');
            }

            const data = await response.json();
            setStory(data);
        } catch (err) {
            setError(err.message || 'Ocurrió un error inesperado');
        } finally {
            setLoading(false);
        }
    };

    const handleRestart = () => {
        setStory(null);
        setError(null);
    };

    return (
        <div className="app-container">
            <h1 className="title-gradient">Cuentos Mágicos ✨</h1>

            {!story ? (
                <div className="fade-in">
                    <StoryForm onSubmit={fetchStory} loading={loading} />
                    {error && (
                        <div style={{ marginTop: '1rem', color: '#ff6b6b', textAlign: 'center', background: 'rgba(255,0,0,0.1)', padding: '1rem', borderRadius: '0.5rem' }}>
                            {error}
                        </div>
                    )}
                </div>
            ) : (
                <div className="fade-in">
                    <StoryReader story={story} onRestart={handleRestart} />
                </div>
            )}
        </div>
    );
}

export default App;
