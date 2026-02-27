import path from 'node:path';
import fs from 'node:fs/promises';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
function parseSqlitePath(databaseUrl) {
    const trimmed = databaseUrl.trim();
    if (!trimmed)
        return '';
    if (trimmed.startsWith('sqlite:'))
        return trimmed.slice('sqlite:'.length);
    return trimmed;
}
export class SqliteDb {
    databaseUrl;
    dbPromise = null;
    constructor(databaseUrl) {
        this.databaseUrl = databaseUrl;
    }
    async getDb() {
        if (this.dbPromise)
            return this.dbPromise;
        const dbPathRaw = parseSqlitePath(this.databaseUrl);
        if (!dbPathRaw)
            throw new Error('DATABASE_URL no está configurada.');
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
//# sourceMappingURL=sqliteDb.js.map