/**
 * Presentación: formulario para generar cuentos
 * Solo UI y eventos - la lógica de envío la recibe por props
 */

import type { StoryRequest } from '../services/storyApi';

interface StoryFormProps {
  onSubmit: (data: StoryRequest) => void;
  isLoading: boolean;
  error: string | null;
}

export function StoryForm({ onSubmit, isLoading, error }: StoryFormProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data: StoryRequest = {
      nombre_nino: (form.nombre_nino as HTMLInputElement).value.trim(),
      edad: parseInt((form.edad as HTMLInputElement).value, 10),
      tema: (form.tema as HTMLInputElement).value.trim(),
      personaje_principal: (form.personaje_principal as HTMLInputElement).value.trim(),
      vocabulario: (form.vocabulario as HTMLSelectElement).value as 'simple' | 'medio',
    };
    onSubmit(data);
  }

  return (
    <form onSubmit={handleSubmit} className="story-form">
      <h2>📖 Crear tu cuento</h2>
      <div className="form-grid">
        <label>
          Nombre del niño/a
          <input
            name="nombre_nino"
            type="text"
            placeholder="Ej: María"
            required
          />
        </label>
        <label>
          Edad (5–9)
          <select name="edad" required>
            {[5, 6, 7, 8, 9].map((n) => (
              <option key={n} value={n}>{n} años</option>
            ))}
          </select>
        </label>
        <label>
          Tema
          <input
            name="tema"
            type="text"
            placeholder="Ej: aventuras en el bosque"
            required
          />
        </label>
        <label>
          Personaje principal
          <input
            name="personaje_principal"
            type="text"
            placeholder="Ej: un conejo valiente"
            required
          />
        </label>
        <label>
          Vocabulario
          <select name="vocabulario" required>
            <option value="simple">Simple</option>
            <option value="medio">Medio</option>
          </select>
        </label>
      </div>
      <button type="submit" className="btn btn-primary btn-large" disabled={isLoading}>
        {isLoading ? '⏳ Generando...' : '✨ Generar cuento'}
      </button>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
}
