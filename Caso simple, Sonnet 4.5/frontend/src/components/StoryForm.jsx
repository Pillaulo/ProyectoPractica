import { useState } from 'react';

function StoryForm({ onStoryGenerated }) {
    const [formData, setFormData] = useState({
        nombre_nino: '',
        edad: 7,
        tema: '',
        personaje_principal: '',
        vocabulario: 'medio'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'edad' ? parseInt(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/story', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al generar el cuento');
            }

            onStoryGenerated(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>
                ✨ Crear un Cuento Nuevo
            </h2>

            {error && (
                <div className="error-message">
                    <strong>Error:</strong> {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="nombre_nino">Nombre del niño/a</label>
                    <input
                        type="text"
                        id="nombre_nino"
                        name="nombre_nino"
                        value={formData.nombre_nino}
                        onChange={handleChange}
                        placeholder="Ej: María"
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="edad">Edad</label>
                        <select
                            id="edad"
                            name="edad"
                            value={formData.edad}
                            onChange={handleChange}
                            required
                        >
                            <option value={5}>5 años</option>
                            <option value={6}>6 años</option>
                            <option value={7}>7 años</option>
                            <option value={8}>8 años</option>
                            <option value={9}>9 años</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="vocabulario">Nivel de vocabulario</label>
                        <select
                            id="vocabulario"
                            name="vocabulario"
                            value={formData.vocabulario}
                            onChange={handleChange}
                            required
                        >
                            <option value="simple">Simple</option>
                            <option value="medio">Medio</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="tema">Tema del cuento</label>
                    <input
                        type="text"
                        id="tema"
                        name="tema"
                        value={formData.tema}
                        onChange={handleChange}
                        placeholder="Ej: aventura espacial, animales del bosque, piratas"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="personaje_principal">Personaje principal</label>
                    <input
                        type="text"
                        id="personaje_principal"
                        name="personaje_principal"
                        value={formData.personaje_principal}
                        onChange={handleChange}
                        placeholder="Ej: un dragón amigable, una astronauta valiente"
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                        <>
                            <div className="loading-spinner" style={{ width: '20px', height: '20px', borderWidth: '3px' }}></div>
                            Generando cuento...
                        </>
                    ) : (
                        <>🎨 Generar Cuento</>
                    )}
                </button>
            </form>
        </div>
    );
}

export default StoryForm;
