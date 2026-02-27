import { type SqliteDb } from '../infrastructure/db/sqliteDb.js';
import { type StoryRequest, type StoryResponse, type StorySessionDetail, type StorySessionListItem } from '../types/story.js';

export class StorySessionRepository {
  constructor(private readonly sqlite: SqliteDb) {}

  async init(): Promise<void> {
    const db = await this.sqlite.getDb();
    await db.exec(`
      CREATE TABLE IF NOT EXISTS story_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at TEXT NOT NULL,
        nombre_nino TEXT NOT NULL,
        edad INTEGER NOT NULL,
        tema TEXT NOT NULL,
        personaje_principal TEXT NOT NULL,
        vocabulario TEXT NOT NULL,
        titulo TEXT NOT NULL,
        frases TEXT NOT NULL,
        parrafos TEXT NOT NULL
      );
    `);
  }

  async createSession(input: StoryRequest, output: StoryResponse): Promise<number> {
    const db = await this.sqlite.getDb();
    const nowIso = new Date().toISOString();
    const res = await db.run(
      `
        INSERT INTO story_sessions (
          created_at, nombre_nino, edad, tema, personaje_principal, vocabulario,
          titulo, frases, parrafos
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        nowIso,
        input.nombre_nino,
        input.edad,
        input.tema,
        input.personaje_principal,
        input.vocabulario,
        output.titulo,
        JSON.stringify(output.frases),
        JSON.stringify(output.parrafos),
      ]
    );

    return res.lastID as number;
  }

  async listSessions(limit = 10): Promise<StorySessionListItem[]> {
    const db = await this.sqlite.getDb();
    const rows = await db.all<any[]>(
      `
        SELECT id, created_at, nombre_nino, tema, titulo
        FROM story_sessions
        ORDER BY datetime(created_at) DESC
        LIMIT ?
      `,
      [limit]
    );

    return rows.map((r) => ({
      id: Number(r.id),
      created_at: String(r.created_at),
      nombre_nino: String(r.nombre_nino),
      tema: String(r.tema),
      titulo: String(r.titulo),
    }));
  }

  async getSessionById(id: number): Promise<StorySessionDetail | null> {
    const db = await this.sqlite.getDb();
    const row = await db.get<any>(
      `
        SELECT
          id, created_at, nombre_nino, edad, tema, personaje_principal, vocabulario,
          titulo, frases, parrafos
        FROM story_sessions
        WHERE id = ?
      `,
      [id]
    );

    if (!row) return null;

    return {
      id: Number(row.id),
      created_at: String(row.created_at),
      nombre_nino: String(row.nombre_nino),
      edad: Number(row.edad),
      tema: String(row.tema),
      personaje_principal: String(row.personaje_principal),
      vocabulario: row.vocabulario === 'simple' ? 'simple' : 'medio',
      titulo: String(row.titulo),
      frases: JSON.parse(String(row.frases)),
      parrafos: JSON.parse(String(row.parrafos)),
    };
  }
}

