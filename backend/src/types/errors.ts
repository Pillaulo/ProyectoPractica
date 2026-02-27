// ──────────────────────────────────────────────────────────
//  Capa: Types – Errores de dominio tipados
//  Responsabilidad: Permitir que el controller distinga
//  el origen del error sin acoplar capas internas.
// ──────────────────────────────────────────────────────────

export class GroqServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GroqServiceError';
  }
}

export class GroqParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GroqParseError';
  }
}
