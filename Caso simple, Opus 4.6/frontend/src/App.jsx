import { useState } from 'react'
import StoryForm from './components/StoryForm'
import StoryReader from './components/StoryReader'
import './App.css'

function App() {
  const [cuento, setCuento] = useState(null)

  const handleReset = () => {
    setCuento(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Cuentos Mágicos</h1>
        <p className="subtitle">Crea cuentos personalizados para aprender a leer</p>
      </header>

      <main>
        {!cuento ? (
          <StoryForm onStoryGenerated={setCuento} />
        ) : (
          <StoryReader cuento={cuento} onReset={handleReset} />
        )}
      </main>
    </div>
  )
}

export default App
