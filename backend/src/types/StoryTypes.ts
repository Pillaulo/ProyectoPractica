/**
 * DTOs y tipos para el dominio de cuentos
 * Capa: Types / DTO
 */

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

export interface StorySession {
  id: number;
  created_at: string;
  nombre_nino: string;
  edad: number;
  tema: string;
  personaje_principal: string;
  vocabulario: string;
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
