// ──────────────────────────────────────────────────────────
//  Capa: Types / DTO
//  Responsabilidad: Definir contratos de datos entre capas.
// ──────────────────────────────────────────────────────────

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

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
  };
}
