// ──────────────────────────────────────────────────────────
//  Entry point del servidor
//  Responsabilidad: Cargar variables de entorno, inicializar
//  la BD (async, sql.js/WASM) y arrancar Express.
// ──────────────────────────────────────────────────────────

import dotenv from 'dotenv';
dotenv.config();

import { initDatabase } from './db/database';
import app from './app';

const PORT = parseInt(process.env.PORT ?? '3001', 10);

async function main(): Promise<void> {
  try {
    await initDatabase();
    console.log(`✅  BD SQLite inicializada en: ${process.env.DATABASE_URL ?? './data/stories.db'}`);
  } catch (err) {
    console.error('❌  Error al inicializar la base de datos:', err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`✅  Backend corriendo en http://localhost:${PORT}`);
    console.log(`   CORS permitido para: ${process.env.FRONTEND_URL ?? 'http://localhost:5173'}`);
  });
}

main();
