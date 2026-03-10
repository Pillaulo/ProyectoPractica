import { API_BASE_URL } from '../config';
import type { ApiError } from './types';

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<{ data?: T; error?: ApiError }> {
  const url = `${API_BASE_URL}${path}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        error: {
          code: json.code ?? 'UNKNOWN_ERROR',
          message: json.message ?? `Error ${res.status}`,
          details: json.details,
        },
      };
    }

    return { data: json as T };
  } catch (err) {
    return {
      error: {
        code: 'NETWORK_ERROR',
        message: err instanceof Error ? err.message : 'Error de conexión',
      },
    };
  }
}

export const api = {
  getProfiles: () => request<{ profiles: { id: string; name: string; readingLevel: string; themes: string[] }[] }>('/api/v1/profiles'),
  createProfile: (body: { name: string; readingLevel: string; themes?: string[] }) =>
    request<{ id: string; name: string; readingLevel: string; themes: string[] }>('/api/v1/profiles', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  getStoriesByProfile: (profileId: string) =>
    request<{ stories: { id: string; title: string; profileId: string; segmentCount: number; createdAt: string }[] }>(
      `/api/v1/profiles/${profileId}/stories`
    ),
  createStory: (profileId: string, maxLength?: number) =>
    request<{ id: string; title: string; profileId: string; segmentCount: number; createdAt: string }>('/api/v1/stories', {
      method: 'POST',
      body: JSON.stringify({ profileId, maxLength: maxLength ?? 200 }),
    }),
  getStory: (storyId: string) =>
    request<{ id: string; title: string; profileId: string; segmentCount: number; createdAt: string }>(
      `/api/v1/stories/${storyId}`
    ),
  getStorySegments: (storyId: string) =>
    request<{ storyId: string; segments: { id: string; storyId: string; order: number; text: string }[] }>(
      `/api/v1/stories/${storyId}/segments`
    ),
};
