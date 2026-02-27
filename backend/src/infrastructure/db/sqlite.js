const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const initializeDatabase = async (dbFilePath) => {
  if (dbFilePath !== ":memory:") {
    fs.mkdirSync(path.dirname(dbFilePath), { recursive: true });
  }

  const db = await open({
    filename: dbFilePath,
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS story_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
};

module.exports = {
  initializeDatabase,
};
