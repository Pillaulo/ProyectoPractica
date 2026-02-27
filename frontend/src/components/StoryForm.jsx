import { useState } from 'react';

const INITIAL_FORM = {
  nombre_nino: '',
  edad: 5,
  tema: '',
  personaje_principal: '',
  vocabulario: 'simple',
};

export function StoryForm({ onSubmit, loading }) {
  const [form, setForm] = useState(INITIAL_FORM);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'edad' ? parseInt(value, 10) : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form className="story-form" onSubmit={handleSubmit}>
      <h2>📝 Crea tu cuento</h2>

      <div className="form-group">
        <label htmlFor="nombre_nino">Nombre del niño/niña</label>
        <input
          id="nombre_nino"
          name="nombre_nino"
          type="text"
          value={form.nombre_nino}
          onChange={handleChange}
          placeholder="Ej: Sofía"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="edad">Edad</label>
        <select id="edad" name="edad" value={form.edad} onChange={handleChange}>
          {[5, 6, 7, 8, 9].map((n) => (
            <option key={n} value={n}>
              {n} años
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="tema">Tema del cuento</label>
        <input
          id="tema"
          name="tema"
          type="text"
          value={form.tema}
          onChange={handleChange}
          placeholder="Ej: aventura en el espacio"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="personaje_principal">Personaje principal</label>
        <input
          id="personaje_principal"
          name="personaje_principal"
          type="text"
          value={form.personaje_principal}
          onChange={handleChange}
          placeholder="Ej: un dragón amigable"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="vocabulario">Nivel de vocabulario</label>
        <select
          id="vocabulario"
          name="vocabulario"
          value={form.vocabulario}
          onChange={handleChange}
        >
          <option value="simple">Simple</option>
          <option value="medio">Medio</option>
        </select>
      </div>

      <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
        {loading ? '✨ Creando tu cuento...' : '🪄 Generar cuento'}
      </button>
    </form>
  );
}
