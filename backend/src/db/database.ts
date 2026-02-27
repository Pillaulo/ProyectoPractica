// ──────────────────────────────────────────────────────────
//  Capa: Infraestructura – Conexión y esquema de la BD
//  Responsabilidad: Inicializar la base de datos SQLite
//  (mediante sql.js, puro JavaScript/WASM sin compilación
//  nativa), crear las tablas si no existen, y proveer
//  helpers para obtener la instancia y persistir en disco.
//  Solo esta capa conoce los detalles de conexión.
// ──────────────────────────────────────────────────────────

import initSqlJs, { Database } from 'sql.js';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.resolve(process.env.DATABASE_URL ?? './data/stories.db');

let _db: Database | null = null;

export function getDb(): Database {
  if (!_db) {
    throw new Error('La base de datos no está inicializada. Llama a initDatabase() primero.');
  }
  return _db;
}

export function persistDb(): void {
  if (!_db) return;
  const data = _db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

export async function initDatabase(): Promise<void> {
  const dbDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    _db = new SQL.Database(fileBuffer);
  } else {
    _db = new SQL.Database();
  }

  _db.run(`
    CREATE TABLE IF NOT EXISTS story_sessions (
      id                  INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at          TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
      nombre_nino         TEXT    NOT NULL,
      edad                INTEGER NOT NULL,
      tema                TEXT    NOT NULL,
      personaje_principal TEXT    NOT NULL,
      vocabulario         TEXT    NOT NULL,
      titulo              TEXT    NOT NULL,
      frases              TEXT    NOT NULL,
      parrafos            TEXT    NOT NULL
    );
  `);

  // Persistir el esquema inicial si el archivo no existía
  persistDb();
}
