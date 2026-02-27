// ──────────────────────────────────────────────────────────
//  Capa: Infraestructura HTTP (services/)
//  Responsabilidad: Único punto de contacto con la API del
//  backend. NO construye prompts, NO llama a Groq, NO
//  normaliza datos de IA. Solo gestiona peticiones HTTP.
// ──────────────────────────────────────────────────────────

import { StoryFormData, Story, SessionSummary, SessionDetail } from '../types/story';

const BASE_URL = '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Error HTTP ${res.status}`;
    try {
      const body = await res.json() as { error?: { message?: string } };
      if (body?.error?.message) message = body.error.message;
    } catch {
      // La respuesta no era JSON; mantenemos el mensaje genérico
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export const storyApi = {
  async generateStory(data: StoryFormData): Promise<Story> {
    const res = await fetch(`${BASE_URL}/story`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Story>(res);
  },

  async getSessions(): Promise<SessionSummary[]> {
    const res = await fetch(`${BASE_URL}/sessions`);
    return handleResponse<SessionSummary[]>(res);
  },

  async getSession(id: number): Promise<SessionDetail> {
    const res = await fetch(`${BASE_URL}/sessions/${id}`);
    return handleResponse<SessionDetail>(res);
  },
};
