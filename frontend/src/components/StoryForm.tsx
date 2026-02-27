// ──────────────────────────────────────────────────────────
//  Capa: Presentación
//  Responsabilidad: Renderizar el formulario y emitir eventos.
//  No contiene lógica de negocio ni llamadas HTTP.
// ──────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { StoryFormData } from '../types/story';

interface Props {
  onSubmit: (data: StoryFormData) => void;
  loading: boolean;
}

const FIELD_STYLE: React.CSSProperties = {
  width: '100%',
  padding: '13px 16px',
  fontSize: 16,
  borderRadius: 12,
  border: '2px solid #dce3f0',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  background: '#fafbff',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  color: '#333',
};

const LABEL_STYLE: React.CSSProperties = {
  display: 'block',
  marginBottom: 6,
  fontWeight: 700,
  fontSize: 16,
  color: '#444',
};

const StoryForm: React.FC<Props> = ({ onSubmit, loading }) => {
  const [form, setForm] = useState<StoryFormData>({
    nombre_nino: '',
    edad: 6,
    tema: '',
    personaje_principal: '',
    vocabulario: 'simple',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'edad' ? parseInt(value, 10) : value,
    }));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = '#4D96FF';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(77,150,255,0.15)';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = '#dce3f0';
    e.currentTarget.style.boxShadow = 'none';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const fieldProps = { style: FIELD_STYLE, onFocus: handleFocus, onBlur: handleBlur };

  return (
    <div
      style={{
        background: 'white',
        borderRadius: 24,
        padding: '32px 28px',
        boxShadow: '0 6px 32px rgba(0,0,0,0.08)',
        border: '3px solid #FFD93D',
      }}
    >
      <h2
        style={{
          fontSize: 28,
          color: '#FF6B6B',
          marginBottom: 8,
          textAlign: 'center',
          fontWeight: 900,
        }}
      >
        ✨ Crear mi Cuento
      </h2>
      <p
        style={{
          textAlign: 'center',
          color: '#888',
          fontSize: 15,
          marginBottom: 28,
          marginTop: 0,
        }}
      >
        Rellena los datos y genera un cuento único
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: 20 }}>
          <div>
            <label style={LABEL_STYLE} htmlFor="nombre_nino">
              👦 Nombre del niño/niña
            </label>
            <input
              id="nombre_nino"
              name="nombre_nino"
              type="text"
              value={form.nombre_nino}
              onChange={handleChange}
              placeholder="Ej: Sofía, Mateo, Luna…"
              required
              maxLength={50}
              {...fieldProps}
            />
          </div>

          <div>
            <label style={LABEL_STYLE} htmlFor="edad">
              🎂 Edad (5 a 9 años)
            </label>
            <input
              id="edad"
              name="edad"
              type="number"
              min={5}
              max={9}
              value={form.edad}
              onChange={handleChange}
              required
              {...fieldProps}
            />
          </div>

          <div>
            <label style={LABEL_STYLE} htmlFor="tema">
              🌟 Tema del cuento
            </label>
            <input
              id="tema"
              name="tema"
              type="text"
              value={form.tema}
              onChange={handleChange}
              placeholder="Ej: Una aventura en el bosque mágico"
              required
              maxLength={100}
              {...fieldProps}
            />
          </div>

          <div>
            <label style={LABEL_STYLE} htmlFor="personaje_principal">
              🦸 Personaje principal
            </label>
            <input
              id="personaje_principal"
              name="personaje_principal"
              type="text"
              value={form.personaje_principal}
              onChange={handleChange}
              placeholder="Ej: un dragón amigable, una princesa valiente…"
              required
              maxLength={100}
              {...fieldProps}
            />
          </div>

          <div>
            <label style={LABEL_STYLE} htmlFor="vocabulario">
              📚 Nivel de vocabulario
            </label>
            <select
              id="vocabulario"
              name="vocabulario"
              value={form.vocabulario}
              onChange={handleChange}
              {...fieldProps}
            >
              <option value="simple">Simple – palabras básicas y cortas</option>
              <option value="medio">Medio – un poco más elaborado</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#bbb' : '#FF6B6B',
              color: 'white',
              border: 'none',
              borderRadius: 16,
              padding: '16px 32px',
              fontSize: 20,
              fontWeight: 900,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: 8,
              width: '100%',
              transition: 'background 0.2s, transform 0.1s',
              letterSpacing: 0.3,
            }}
            onMouseOver={(e) => {
              if (!loading) e.currentTarget.style.background = '#e05555';
            }}
            onMouseOut={(e) => {
              if (!loading) e.currentTarget.style.background = '#FF6B6B';
            }}
          >
            {loading ? '⏳ Generando cuento…' : '🚀 ¡Generar mi Cuento!'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StoryForm;
