import { apiClient } from './apiClient';
import { StoryRequest, StoryResponse, StorySession } from '../types';

export const generateStory = (request: StoryRequest): Promise<StoryResponse> => {
    return apiClient<StoryResponse>('/story', {
        method: 'POST',
        body: JSON.stringify(request)
    });
};

export const getRecentSessions = (): Promise<Partial<StorySession>[]> => {
    return apiClient<Partial<StorySession>[]>('/sessions');
};

export const getSessionById = (id: number): Promise<StorySession> => {
    return apiClient<StorySession>(`/sessions/${id}`);
};
