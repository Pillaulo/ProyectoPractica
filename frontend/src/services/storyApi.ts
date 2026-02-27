/**
 * Infraestructura HTTP - llamadas al backend
 * Capa: Infraestructura
 * Solo realiza peticiones HTTP, NO construye prompts ni llama a Groq
 */

const API_BASE = '/api';

export interface StoryRequest {
  nombre_nino: string;
  edad: number;
  tema: string;
  personaje_principal: string;
  vocabulario: 'simple' | 'medio';
}

export interface StoryResponse {
  titulo: string;
  frases: string[];
  parrafos: string[];
}

export interface SessionListItem {
  id: number;
  fecha: string;
  nombre_nino: string;
  tema: string;
  titulo: string;
}

export interface SessionDetail extends StoryResponse {
  id: number;
  created_at: string;
  nombre_nino: string;
  edad: number;
  tema: string;
  personaje_principal: string;
  vocabulario: string;
}

export interface ApiError {
  error: { code: string; message: string };
}

async function handleResponse<T>(res: Response): Promise<T> {
  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Error ${res.status}: respuesta no válida`);
  }

  if (!res.ok) {
    const err = data as ApiError;
    throw new Error(err?.error?.message ?? `Error ${res.status}`);
  }

  return data as T;
}

export async function generateStory(body: StoryRequest): Promise<StoryResponse> {
  const res = await fetch(`${API_BASE}/story`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleResponse<StoryResponse>(res);
}

export async function getSessions(): Promise<SessionListItem[]> {
  const res = await fetch(`${API_BASE}/sessions`);
  return handleResponse<SessionListItem[]>(res);
}

export async function getSessionById(id: number): Promise<SessionDetail> {
  const res = await fetch(`${API_BASE}/sessions/${id}`);
  return handleResponse<SessionDetail>(res);
}
