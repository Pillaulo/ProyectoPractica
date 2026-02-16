import { useState } from 'react';

function Formulario({ onSubmit, loading, error }) {
  const [nombre_nino, setNombreNino] = useState('');
  const [edad, setEdad] = useState(6);
  const [tema, setTema] = useState('');
  const [personaje_principal, setPersonajePrincipal] = useState('');
  const [vocabulario, setVocabulario] = useState('simple');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      nombre_nino: nombre_nino.trim(),
      edad: Number(edad),
      tema: tema.trim(),
      personaje_principal: personaje_principal.trim(),
      vocabulario,
    });
  };

  return (
    <form className="formulario" onSubmit={handleSubmit}>
      <div className="campo">
        <label htmlFor="nombre_nino">Nombre del niño/a</label>
        <input
          id="nombre_nino"
          type="text"
          value={nombre_nino}
          onChange={(e) => setNombreNino(e.target.value)}
          placeholder="Ej: Lucía"
          required
        />
      </div>

      <div className="campo">
        <label htmlFor="edad">Edad (5–9 años)</label>
        <input
          id="edad"
          type="number"
          min={5}
          max={9}
          value={edad}
          onChange={(e) => setEdad(e.target.value)}
        />
      </div>

      <div className="campo">
        <label htmlFor="tema">Tema del cuento</label>
        <input
          id="tema"
          type="text"
          value={tema}
          onChange={(e) => setTema(e.target.value)}
          placeholder="Ej: La amistad con los animales"
          required
        />
      </div>

      <div className="campo">
        <label htmlFor="personaje_principal">Personaje principal</label>
        <input
          id="personaje_principal"
          type="text"
          value={personaje_principal}
          onChange={(e) => setPersonajePrincipal(e.target.value)}
          placeholder="Ej: Un dragón amigable"
          required
        />
      </div>

      <div className="campo">
        <label htmlFor="vocabulario">Vocabulario</label>
        <select
          id="vocabulario"
          value={vocabulario}
          onChange={(e) => setVocabulario(e.target.value)}
        >
          <option value="simple">Simple</option>
          <option value="medio">Medio</option>
        </select>
      </div>

      {error && <p className="error">{error}</p>}

      <button type="submit" className="btn-generar" disabled={loading}>
        {loading ? 'Generando...' : 'Generar cuento'}
      </button>
    </form>
  );
}

export default Formulario;
