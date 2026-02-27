import path from 'node:path';
import fs from 'node:fs/promises';
import sqlite3 from 'sqlite3';
import { open, type Database } from 'sqlite';

function parseSqlitePath(databaseUrl: string): string {
  const trimmed = databaseUrl.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('sqlite:')) return trimmed.slice('sqlite:'.length);
  return trimmed;
}

export class SqliteDb {
  private dbPromise: Promise<Database<sqlite3.Database, sqlite3.Statement>> | null = null;

  constructor(private readonly databaseUrl: string) {}

  async getDb(): Promise<Database<sqlite3.Database, sqlite3.Statement>> {
    if (this.dbPromise) return this.dbPromise;

    const dbPathRaw = parseSqlitePath(this.databaseUrl);
    if (!dbPathRaw) throw new Error('DATABASE_URL no está configurada.');

    const dbPath = path.isAbsolute(dbPathRaw)
      ? dbPathRaw
      : path.resolve(process.cwd(), dbPathRaw);

    await fs.mkdir(path.dirname(dbPath), { recursive: true });

    this.dbPromise = open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    return this.dbPromise;
  }
}

