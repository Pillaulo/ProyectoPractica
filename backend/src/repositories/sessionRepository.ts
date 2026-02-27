// ──────────────────────────────────────────────────────────
//  Capa: Repository / Data Access Layer
//  Responsabilidad: ÚNICO punto de acceso a la BD.
//  Traduce entre tipos de dominio y filas SQLite (sql.js).
//  Nadie fuera de esta capa llama a getDb() o persistDb().
// ──────────────────────────────────────────────────────────

import { getDb, persistDb } from '../db/database';
import { StoryRequest, StoryResponse, SessionSummary, SessionDetail } from '../types/dto';

interface SessionRow {
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

/** Ejecuta un SELECT y devuelve filas como objetos tipados. */
function queryAll<T>(sql: string, params: (string | number)[] = []): T[] {
  const db = getDb();
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows: T[] = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject() as unknown as T);
  }
  stmt.free();
  return rows;
}

/** Ejecuta un SELECT y devuelve la primera fila o null. */
function queryOne<T>(sql: string, params: (string | number)[] = []): T | null {
  const db = getDb();
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const found = stmt.step();
  const row = found ? (stmt.getAsObject() as unknown as T) : null;
  stmt.free();
  return row;
}

export const sessionRepository = {
  save(request: StoryRequest, response: StoryResponse): number {
    const db = getDb();
    db.run(
      `INSERT INTO story_sessions
         (nombre_nino, edad, tema, personaje_principal, vocabulario, titulo, frases, parrafos)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        request.nombre_nino,
        request.edad,
        request.tema,
        request.personaje_principal,
        request.vocabulario,
        response.titulo,
        JSON.stringify(response.frases),
        JSON.stringify(response.parrafos),
      ],
    );
    persistDb();

    const result = queryOne<{ id: number }>('SELECT last_insert_rowid() AS id');
    return result?.id ?? 0;
  },

  findAll(limit = 20): SessionSummary[] {
    return queryAll<SessionSummary>(
      `SELECT id, created_at, nombre_nino, tema, titulo
       FROM   story_sessions
       ORDER  BY created_at DESC
       LIMIT  ?`,
      [limit],
    );
  },

  findById(id: number): SessionDetail | null {
    const row = queryOne<SessionRow>(
      `SELECT id, created_at, nombre_nino, edad, tema, personaje_principal, vocabulario, titulo, frases, parrafos
       FROM   story_sessions
       WHERE  id = ?`,
      [id],
    );

    if (!row) return null;

    return {
      id: row.id,
      created_at: row.created_at,
      nombre_nino: row.nombre_nino,
      edad: row.edad,
      tema: row.tema,
      personaje_principal: row.personaje_principal,
      vocabulario: row.vocabulario,
      titulo: row.titulo,
      frases: JSON.parse(row.frases) as string[],
      parrafos: JSON.parse(row.parrafos) as string[],
    };
  },
};
