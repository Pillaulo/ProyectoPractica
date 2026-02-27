import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { StorySession, StoryRequest, StoryResponse } from '../types';

let db: Database | null = null;

export const initDB = async () => {
    const dbPath = process.env.DATABASE_URL || './story_sessions.sqlite';
    db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    await db.exec(`
    CREATE TABLE IF NOT EXISTS story_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      nombre_nino TEXT NOT NULL,
      edad INTEGER NOT NULL,
      tema TEXT NOT NULL,
      personaje_principal TEXT NOT NULL,
      vocabulario TEXT NOT NULL,
      titulo TEXT NOT NULL,
      frases TEXT NOT NULL,
      parrafos TEXT NOT NULL
    )
  `);
};

export const saveStorySession = async (
    request: StoryRequest,
    response: StoryResponse
): Promise<number> => {
    if (!db) throw new Error("Database not initialized");

    const result = await db.run(
        `INSERT INTO story_sessions (nombre_nino, edad, tema, personaje_principal, vocabulario, titulo, frases, parrafos)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        request.nombre_nino,
        request.edad,
        request.tema,
        request.personaje_principal,
        request.vocabulario,
        response.titulo,
        JSON.stringify(response.frases),
        JSON.stringify(response.parrafos)
    );

    return result.lastID!;
};

export const getRecentSessions = async (limit: number = 10): Promise<Partial<StorySession>[]> => {
    if (!db) throw new Error("Database not initialized");

    const rows = await db.all(
        `SELECT id, created_at, nombre_nino, tema, titulo 
     FROM story_sessions 
     ORDER BY created_at DESC 
     LIMIT ?`,
        limit
    );
    return rows;
};

export const getSessionById = async (id: number): Promise<StorySession | null> => {
    if (!db) throw new Error("Database not initialized");

    const row = await db.get(`SELECT * FROM story_sessions WHERE id = ?`, id);
    if (!row) return null;

    return {
        ...row,
        frases: JSON.parse(row.frases),
        parrafos: JSON.parse(row.parrafos)
    };
};
