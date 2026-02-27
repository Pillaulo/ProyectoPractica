import React, { useEffect, useState } from 'react';
import { getRecentSessions, getSessionById } from '../services/storyApi';
import { StorySession } from '../types';

interface HistoryListProps {
    onSelectStory: (story: StorySession) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ onSelectStory }) => {
    const [history, setHistory] = useState<Partial<StorySession>[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchHistory = async () => {
        try {
            const sessions = await getRecentSessions();
            setHistory(sessions);
        } catch (err: any) {
            setError(err.message || 'Error al cargar historial');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleSelect = async (id: number) => {
        try {
            const session = await getSessionById(id);
            onSelectStory(session);
        } catch (err: any) {
            alert(err.message || 'Error al cargar el cuento');
        }
    };

    if (loading) return <div>Cargando historial...</div>;
    if (error) return <div style={{ color: 'var(--primary)' }}>{error}</div>;

    if (history.length === 0) return <div>Aún no hay cuentos creados. ¡Sé el primero!</div>;

    return (
        <div className="card">
            <h2>📚 Historial de Cuentos</h2>
            <button className="btn-outline mb-4" onClick={fetchHistory} style={{ fontSize: '14px', padding: '6px 12px' }}>
                Actualizar
            </button>
            <div className="flex flex-col gap-4">
                {history.map(session => (
                    <div key={session.id} className="history-item" onClick={() => handleSelect(session.id!)}>
                        <div>
                            <h3>{session.titulo}</h3>
                            <p>🎭 {session.tema} • 👦 {session.nombre_nino}</p>
                        </div>
                        <div style={{ fontSize: '24px' }}>➡️</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
