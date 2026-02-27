import React, { useState } from 'react';
import { StoryRequest } from '../types';

interface StoryFormProps {
    onGenerate: (request: StoryRequest) => void;
    loading: boolean;
}

export const StoryForm: React.FC<StoryFormProps> = ({ onGenerate, loading }) => {
    const [formData, setFormData] = useState<StoryRequest>({
        nombre_nino: '',
        edad: 5,
        tema: '',
        personaje_principal: '',
        vocabulario: 'simple'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGenerate(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'edad' ? parseInt(value, 10) : value
        }));
    };

    return (
        <div className="card">
            <h2 style={{ textAlign: 'center' }}>✨ Crea tu Cuento Mágico ✨</h2>
            <form onSubmit={handleSubmit} className="flex flex-col">
                <label className="label">Nombre del niño/niña:</label>
                <input required type="text" name="nombre_nino" value={formData.nombre_nino} onChange={handleChange} placeholder="Ej: Sofía" />

                <label className="label">Edad (5-9 años):</label>
                <input required type="number" name="edad" min="5" max="9" value={formData.edad} onChange={handleChange} />

                <label className="label">Tema del cuento:</label>
                <input required type="text" name="tema" value={formData.tema} onChange={handleChange} placeholder="Ej: Aventura en el espacio" />

                <label className="label">Personaje principal (animal, mago, etc.):</label>
                <input required type="text" name="personaje_principal" value={formData.personaje_principal} onChange={handleChange} placeholder="Ej: Un dragón amable" />

                <label className="label">Nivel de vocabulario:</label>
                <select name="vocabulario" value={formData.vocabulario} onChange={handleChange}>
                    <option value="simple">Simple (ideal para 5-7 años)</option>
                    <option value="medio">Medio (ideal para 7-9 años)</option>
                </select>

                <button type="submit" className="btn-primary mt-4" disabled={loading}>
                    {loading ? 'Generando magia... 🪄' : 'Generar cuento 🚀'}
                </button>
            </form>
        </div>
    );
};
