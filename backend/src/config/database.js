const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

let db = null;

function getDatabase() {
  if (db) return db;

  const dbPath = path.resolve(process.env.DATABASE_URL || './data/stories.db');
  const dir = path.dirname(dbPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  db = new DatabaseSync(dbPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS story_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT DEFAULT (datetime('now')),
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

  return db;
}

function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}

module.exports = { getDatabase, closeDatabase };
