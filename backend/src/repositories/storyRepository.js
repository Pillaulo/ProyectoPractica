const { getDatabase } = require('../config/database');

function saveSession(request, story) {
  const db = getDatabase();
  const stmt = db.prepare(
    `INSERT INTO story_sessions (nombre_nino, edad, tema, personaje_principal, vocabulario, titulo, frases, parrafos)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const result = stmt.run(
    request.nombre_nino,
    request.edad,
    request.tema,
    request.personaje_principal,
    request.vocabulario,
    story.titulo,
    JSON.stringify(story.frases),
    JSON.stringify(story.parrafos)
  );

  return result.lastInsertRowid;
}

function getAllSessions() {
  const db = getDatabase();
  const stmt = db.prepare(
    'SELECT id, created_at, nombre_nino, tema, titulo FROM story_sessions ORDER BY created_at DESC'
  );
  return stmt.all();
}

function getSessionById(id) {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM story_sessions WHERE id = ?');
  const row = stmt.get(id);

  if (!row) return null;

  return {
    ...row,
    frases: JSON.parse(row.frases),
    parrafos: JSON.parse(row.parrafos),
  };
}

module.exports = { saveSession, getAllSessions, getSessionById };
