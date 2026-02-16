import { useState } from 'react';
import StoryForm from './components/StoryForm';
import StoryReader from './components/StoryReader';

function App() {
    const [story, setStory] = useState(null);

    const handleStoryGenerated = (generatedStory) => {
        setStory(generatedStory);
    };

    const handleReset = () => {
        setStory(null);
    };

    return (
        <div className="app">
            <header className="header">
                <h1>📚 Cuentos Personalizados</h1>
                <p>Crea historias mágicas para aprender a leer</p>
            </header>

            {!story ? (
                <StoryForm onStoryGenerated={handleStoryGenerated} />
            ) : (
                <StoryReader story={story} onReset={handleReset} />
            )}
        </div>
    );
}

export default App;
