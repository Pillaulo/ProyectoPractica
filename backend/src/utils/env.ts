import { ApiError } from '../errors/apiError.js';

export type Env = {
  GROQ_API_KEY: string;
  DATABASE_URL: string;
  PORT: number;
};

export function loadEnv(): Env {
  const groqKey = (process.env.GROQ_API_KEY ?? '').trim();
  const dbUrl = (process.env.DATABASE_URL ?? '').trim();
  const portRaw = (process.env.PORT ?? '3001').trim();
  const port = Number(portRaw);

  if (!groqKey) {
    throw new ApiError(500, 'INTERNAL_ERROR', 'Falta configurar GROQ_API_KEY en el backend.');
  }
  if (!dbUrl) {
    throw new ApiError(500, 'INTERNAL_ERROR', 'Falta configurar DATABASE_URL en el backend.');
  }
  if (!Number.isFinite(port) || port <= 0) {
    throw new ApiError(500, 'INTERNAL_ERROR', 'PORT inválido.');
  }

  return { GROQ_API_KEY: groqKey, DATABASE_URL: dbUrl, PORT: port };
}

