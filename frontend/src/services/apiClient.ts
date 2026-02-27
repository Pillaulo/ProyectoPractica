import type { ApiErrorResponse } from '../types/story';

export class ApiError extends Error {
  public readonly code: string;
  public readonly status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

async function readJsonSafely(res: Response): Promise<any> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const data = (await readJsonSafely(res)) as ApiErrorResponse | null;
    const message = data?.error?.message || `Error HTTP ${res.status}`;
    const code = data?.error?.code || 'HTTP_ERROR';
    throw new ApiError(code, message, res.status);
  }

  const data = await readJsonSafely(res);
  return data as T;
}

