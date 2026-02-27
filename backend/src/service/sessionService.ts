import { StorySession } from '../types';
import { getRecentSessions, getSessionById } from '../repository/sqliteRepository';

export const listRecentSessions = async (): Promise<Partial<StorySession>[]> => {
    return await getRecentSessions(10);
};

export const fetchSessionById = async (id: number): Promise<StorySession | null> => {
    return await getSessionById(id);
};
