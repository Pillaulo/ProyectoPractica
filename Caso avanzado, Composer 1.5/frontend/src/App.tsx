import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import CrearCuento from './pages/CrearCuento';
import LecturaProgresiva from './pages/LecturaProgresiva';
import Historial from './pages/Historial';

function App() {
  return (
    <div className="app">
      <header className="header">
        <Link to="/" className="logo">
          📖 Cuentos Mágicos
        </Link>
        <nav>
          <Link to="/">Crear cuento</Link>
          <Link to="/historial">Historial</Link>
        </nav>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<CrearCuento />} />
          <Route path="/historial" element={<Historial />} />
          <Route path="/leer/:storyId" element={<LecturaProgresiva />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
