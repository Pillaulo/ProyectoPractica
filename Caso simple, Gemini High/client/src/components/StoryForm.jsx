import { useState } from 'react';

const StoryForm = ({ onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        nombre_nino: '',
        edad: 5,
        tema: '',
        personaje_principal: '',
        vocabulario: 'simple'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'edad' ? parseInt(value) : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>✨ Crea tu Aventura</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Nombre del Niño/a</label>
                    <input
                        type="text"
                        name="nombre_nino"
                        value={formData.nombre_nino}
                        onChange={handleChange}
                        placeholder="Ej: Sofia"
                        required
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Edad ({formData.edad} años)</label>
                    <input
                        type="range"
                        name="edad"
                        min="5"
                        max="9"
                        value={formData.edad}
                        onChange={handleChange}
                        style={{ width: '100%', accentColor: 'var(--primary)' }}
                        disabled={loading}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span>5</span><span>9</span>
                    </div>
                </div>

                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Tema del Cuento</label>
                    <input
                        type="text"
                        name="tema"
                        value={formData.tema}
                        onChange={handleChange}
                        placeholder="Ej: Dinosaurios espaciales"
                        required
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Personaje Principal</label>
                    <input
                        type="text"
                        name="personaje_principal"
                        value={formData.personaje_principal}
                        onChange={handleChange}
                        placeholder="Ej: Un robot amable"
                        required
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Nivel de Vocabulario</label>
                    <select
                        name="vocabulario"
                        value={formData.vocabulario}
                        onChange={handleChange}
                        disabled={loading}
                    >
                        <option value="simple">Simple (Fácil de leer)</option>
                        <option value="medio">Medio (Más descriptivo)</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                    style={{ marginTop: '1rem', width: '100%' }}
                >
                    {loading ? 'Creando magia...' : 'Generar Cuento 🚀'}
                </button>
            </form>
        </div>
    );
};

export default StoryForm;
