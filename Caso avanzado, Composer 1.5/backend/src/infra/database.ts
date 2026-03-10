import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

export function createDatabase(dbPath: string): Database.Database {
  if (dbPath !== ':memory:') {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  runMigrations(db);
  return db;
}

function runMigrations(db: Database.Database): void {
  const schemaPath = path.join(process.cwd(), 'docs', 'schema.sql');
  const altPath = path.join(process.cwd(), '..', 'docs', 'schema.sql');

  let schemaContent: string;
  if (fs.existsSync(schemaPath)) {
    schemaContent = fs.readFileSync(schemaPath, 'utf-8');
  } else if (fs.existsSync(altPath)) {
    schemaContent = fs.readFileSync(altPath, 'utf-8');
  } else {
    schemaContent = getEmbeddedSchema();
  }

  db.exec(schemaContent);
}

function getEmbeddedSchema(): string {
  return `
CREATE TABLE IF NOT EXISTS reader_profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  reading_level TEXT NOT NULL,
  themes TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS stories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  profile_id TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_stories_profile_id ON stories(profile_id);

CREATE TABLE IF NOT EXISTS story_segments (
  id TEXT PRIMARY KEY,
  story_id TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  text TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_story_segments_story_id ON story_segments(story_id);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  story_id TEXT NOT NULL,
  current_segment_index INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_sessions_story_id ON sessions(story_id);
`;
}
