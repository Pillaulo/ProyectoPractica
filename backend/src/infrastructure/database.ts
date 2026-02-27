/**
 * Configuración de base de datos SQLite (sql.js - sin compilación nativa)
 * Capa: Infraestructura
 */

import initSqlJs, { type Database } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let dbInstance: Database | null = null;

async function initDb(): Promise<Database> {
  const SQL = await initSqlJs();
  const defaultPath = path.join(__dirname, '..', '..', 'data', 'stories.db');
  const dbPath = process.env.DATABASE_URL || defaultPath;
  const resolvedPath = dbPath.startsWith('file:') ? dbPath.replace('file:', '') : dbPath;
  const dir = path.dirname(resolvedPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  let db: Database;
  if (fs.existsSync(resolvedPath)) {
    const buffer = fs.readFileSync(resolvedPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS story_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
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

  (db as Database & { _path?: string })._path = resolvedPath;
  return db;
}

export function getDb(): Database {
  if (!dbInstance) {
    throw new Error('Database no inicializada. Llame a initDatabase() primero.');
  }
  return dbInstance;
}

export async function initDatabase(): Promise<void> {
  if (dbInstance) return;
  dbInstance = await initDb();
}

export function persistDb(): void {
  const db = getDb();
  const pathObj = db as Database & { _path?: string };
  if (pathObj._path) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(pathObj._path, buffer);
  }
}
