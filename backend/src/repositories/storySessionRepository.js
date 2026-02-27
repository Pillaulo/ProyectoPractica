class StorySessionRepository {
  constructor(db) {
    this.db = db;
  }

  async createSession(input, story) {
    const result = await this.db.run(
      `
      INSERT INTO story_sessions (
        nombre_nino, edad, tema, personaje_principal, vocabulario, titulo, frases, parrafos
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        input.nombre_nino,
        input.edad,
        input.tema,
        input.personaje_principal,
        input.vocabulario,
        story.titulo,
        JSON.stringify(story.frases),
        JSON.stringify(story.parrafos),
      ]
    );

    return result.lastID;
  }

  async listSessions(limit = 20) {
    return this.db.all(
      `
      SELECT id, created_at AS fecha, nombre_nino, tema, titulo
      FROM story_sessions
      ORDER BY datetime(created_at) DESC
      LIMIT ?
      `,
      [limit]
    );
  }

  async findSessionById(id) {
    const row = await this.db.get(
      `
      SELECT
        id, created_at AS fecha, nombre_nino, edad, tema, personaje_principal, vocabulario, titulo, frases, parrafos
      FROM story_sessions
      WHERE id = ?
      `,
      [id]
    );

    if (!row) {
      return null;
    }

    return {
      ...row,
      frases: JSON.parse(row.frases),
      parrafos: JSON.parse(row.parrafos),
    };
  }
}

module.exports = {
  StorySessionRepository,
};
