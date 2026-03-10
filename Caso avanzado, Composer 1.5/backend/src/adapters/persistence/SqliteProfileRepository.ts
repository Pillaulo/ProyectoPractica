import Database from 'better-sqlite3';
import { ReaderId } from '../../domain/value-objects/ReaderId';
import { ReaderProfile } from '../../domain/entities/ReaderProfile';
import { ReadingLevel } from '../../domain/value-objects/ReadingLevel';
import { Theme } from '../../domain/value-objects/Theme';
import { ProfileRepository } from '../../ports/ProfileRepository';

export class SqliteProfileRepository implements ProfileRepository {
  constructor(private readonly db: Database.Database) {}

  async save(profile: ReaderProfile): Promise<void> {
    const themesJson = JSON.stringify(profile.getThemes().map((t) => t.getValue()));
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO reader_profiles (id, name, reading_level, themes, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(
      profile.getId().getValue(),
      profile.getName(),
      profile.getReadingLevel().getValue(),
      themesJson,
      new Date().toISOString()
    );
  }

  async findById(id: ReaderId): Promise<ReaderProfile | null> {
    const row = this.db
      .prepare('SELECT id, name, reading_level, themes FROM reader_profiles WHERE id = ?')
      .get(id.getValue()) as { id: string; name: string; reading_level: string; themes: string } | undefined;

    if (!row) return null;

    const themesRaw = JSON.parse(row.themes) as string[];
    const themes = themesRaw.map((t) => Theme.create(t));
    const readingLevel = ReadingLevel.create(row.reading_level);
    const readerId = ReaderId.create(row.id);

    return ReaderProfile.create(readerId, row.name, readingLevel, themes);
  }

  async findAll(): Promise<ReaderProfile[]> {
    const rows = this.db
      .prepare('SELECT id, name, reading_level, themes FROM reader_profiles')
      .all() as { id: string; name: string; reading_level: string; themes: string }[];

    return rows.map((row) => {
      const themesRaw = JSON.parse(row.themes) as string[];
      const themes = themesRaw.map((t) => Theme.create(t));
      const readingLevel = ReadingLevel.create(row.reading_level);
      const readerId = ReaderId.create(row.id);
      return ReaderProfile.create(readerId, row.name, readingLevel, themes);
    });
  }
}
