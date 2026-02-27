/**
 * Capa de acceso a datos para sesiones de cuentos
 * Capa: Repository / Data Access Layer
 * Única capa que interactúa con la base de datos
 */

import type { StoryResponse } from '../types/StoryTypes.js';
import type { ValidatedStoryRequest } from '../validators/StoryValidator.js';

export interface StorySessionEntity {
  id: number;
  created_at: string;
  nombre_nino: string;
  edad: number;
  tema: string;
  personaje_principal: string;
  vocabulario: string;
  titulo: string;
  frases: string;
  parrafos: string;
}

export interface StoryRepositoryDeps {
  getDb: () => import('sql.js').Database;
  persistDb: () => void;
}

export type StoryRepositoryInstance = ReturnType<typeof createStoryRepository>;

export function createStoryRepository(deps: StoryRepositoryDeps) {
  return {
    save(request: ValidatedStoryRequest, response: StoryResponse): number {
      const db = deps.getDb();
      const stmt = db.prepare(
        `INSERT INTO story_sessions (
          nombre_nino, edad, tema, personaje_principal, vocabulario,
          titulo, frases, parrafos
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      );
      stmt.bind([
        request.nombre_nino,
        request.edad,
        request.tema,
        request.personaje_principal,
        request.vocabulario,
        response.titulo,
        JSON.stringify(response.frases),
        JSON.stringify(response.parrafos),
      ]);
      stmt.step();
      stmt.free();
      const result = db.exec('SELECT last_insert_rowid() as id');
      const id = (result[0]?.values[0]?.[0] as number) ?? 0;
      deps.persistDb();
      return id;
    },

    findLatest(limit: number = 20): Array<{
      id: number;
      fecha: string;
      nombre_nino: string;
      tema: string;
      titulo: string;
    }> {
      const db = deps.getDb();
      const stmt = db.prepare(`
        SELECT id, created_at as fecha, nombre_nino, tema, titulo
        FROM story_sessions
        ORDER BY created_at DESC
        LIMIT ?
      `);
      stmt.bind([limit]);
      const rows: Array<{ id: number; fecha: string; nombre_nino: string; tema: string; titulo: string }> = [];
      while (stmt.step()) {
        const row = stmt.getAsObject();
        rows.push({
          id: row.id as number,
          fecha: row.fecha as string,
          nombre_nino: row.nombre_nino as string,
          tema: row.tema as string,
          titulo: row.titulo as string,
        });
      }
      stmt.free();
      return rows;
    },

    findById(
      id: number,
    ): {
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
    } | null {
      const db = deps.getDb();
      const stmt = db.prepare(`
        SELECT id, created_at, nombre_nino, edad, tema, personaje_principal,
               vocabulario, titulo, frases, parrafos
        FROM story_sessions
        WHERE id = ?
      `);
      stmt.bind([id]);
      if (!stmt.step()) {
        stmt.free();
        return null;
      }
      const row = stmt.getAsObject();
      stmt.free();
      return {
        id: row.id as number,
        created_at: row.created_at as string,
        nombre_nino: row.nombre_nino as string,
        edad: row.edad as number,
        tema: row.tema as string,
        personaje_principal: row.personaje_principal as string,
        vocabulario: row.vocabulario as string,
        titulo: row.titulo as string,
        frases: JSON.parse(row.frases as string) as string[],
        parrafos: JSON.parse(row.parrafos as string) as string[],
      };
    },
  };
}
