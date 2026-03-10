-- Esquema de base de datos para Cuentos Personalizados
-- Compatible con SQLite (desarrollo) y PostgreSQL (producción)
-- Versión: 1.0

-- Perfiles de lectores (niños)
CREATE TABLE IF NOT EXISTS reader_profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  reading_level TEXT NOT NULL CHECK (reading_level IN ('inicial', 'basico', 'intermedio', 'avanzado')),
  themes TEXT NOT NULL DEFAULT '[]',  -- JSON array: ["animales", "fantasia", ...]
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- Cuentos generados
CREATE TABLE IF NOT EXISTS stories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  profile_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (profile_id) REFERENCES reader_profiles(id)
);

CREATE INDEX IF NOT EXISTS idx_stories_profile_id ON stories(profile_id);

-- Segmentos del cuento (para lectura progresiva)
CREATE TABLE IF NOT EXISTS story_segments (
  id TEXT PRIMARY KEY,
  story_id TEXT NOT NULL,
  order_index INTEGER NOT NULL CHECK (order_index >= 1),
  text TEXT NOT NULL,
  FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_story_segments_story_id ON story_segments(story_id);

-- Sesiones de lectura (progreso por cuento)
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  story_id TEXT NOT NULL,
  current_segment_index INTEGER NOT NULL DEFAULT 0 CHECK (current_segment_index >= 0),
  created_at TEXT NOT NULL,
  updated_at TEXT,
  FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_story_id ON sessions(story_id);
