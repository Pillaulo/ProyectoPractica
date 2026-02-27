// ──────────────────────────────────────────────────────────
//  Capa: Types / DTO del Frontend
//  Responsabilidad: Contratos de datos para el UI.
//  Espejo de los DTOs del backend; el frontend no los importa
//  directamente del backend para mantener separación.
// ──────────────────────────────────────────────────────────

export interface StoryFormData {
  nombre_nino: string;
  edad: number;
  tema: string;
  personaje_principal: string;
  vocabulario: 'simple' | 'medio';
}

export interface Story {
  titulo: string;
  frases: string[];
  parrafos: string[];
}

export type ReadingMode = 'frases' | 'parrafos';

export interface SessionSummary {
  id: number;
  created_at: string;
  nombre_nino: string;
  tema: string;
  titulo: string;
}

export interface SessionDetail extends SessionSummary {
  edad: number;
  personaje_principal: string;
  vocabulario: string;
  frases: string[];
  parrafos: string[];
}
