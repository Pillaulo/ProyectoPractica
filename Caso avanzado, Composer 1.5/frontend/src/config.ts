/**
 * Base URL del backend. Configurada por variable de entorno.
 * Vite expone env vars con prefijo VITE_
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';
