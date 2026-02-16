import { useState } from 'react'
import './StoryForm.css'

const INITIAL_FORM = {
  nombre_nino: '',
  edad: 5,
  tema: '',
  personaje_principal: '',
  vocabulario: 'simple'
}

export default function StoryForm({ onStoryGenerated }) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('/api/story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          edad: Number(form.edad)
        })
      })

      const data = await response.json()

      if (!response.ok) {
        const mensaje = data.detalles
          ? data.detalles.join(' ')
          : data.detalle || data.error || 'Error desconocido'
        throw new Error(mensaje)
      }

      onStoryGenerated(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="story-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="nombre_nino">Nombre del niño/a</label>
        <input
          id="nombre_nino"
          name="nombre_nino"
          type="text"
          placeholder="Ej: Sofía"
          value={form.nombre_nino}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="edad">Edad</label>
        <select id="edad" name="edad" value={form.edad} onChange={handleChange}>
          {[5, 6, 7, 8, 9].map((e) => (
            <option key={e} value={e}>{e} años</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="tema">Tema del cuento</label>
        <input
          id="tema"
          name="tema"
          type="text"
          placeholder="Ej: aventura en el espacio"
          value={form.tema}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="personaje_principal">Personaje principal</label>
        <input
          id="personaje_principal"
          name="personaje_principal"
          type="text"
          placeholder="Ej: un dragón amigable"
          value={form.personaje_principal}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="vocabulario">Nivel de vocabulario</label>
        <select id="vocabulario" name="vocabulario" value={form.vocabulario} onChange={handleChange}>
          <option value="simple">Simple</option>
          <option value="medio">Medio</option>
        </select>
      </div>

      {error && <div className="form-error">{error}</div>}

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? (
          <span className="loading-content">
            <span className="spinner"></span>
            Generando cuento...
          </span>
        ) : (
          'Generar cuento'
        )}
      </button>
    </form>
  )
}
