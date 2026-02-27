import type { SessionDetail, SessionListItem, StoryRequest, StoryResponse } from '../types/story';
import { apiFetch } from './apiClient';

export const storyApi = {
  createStory(input: StoryRequest) {
    return apiFetch<StoryResponse>('/api/story', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
  listSessions() {
    return apiFetch<SessionListItem[]>('/api/sessions');
  },
  getSession(id: number) {
    return apiFetch<SessionDetail>(`/api/sessions/${id}`);
  },
};

