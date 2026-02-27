/**
 * Punto de entrada del backend
 * Configura Express, CORS, rutas e inicialización de BD
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { getDb, initDatabase, persistDb } from './infrastructure/database.js';
import { createStoryRepository } from './repositories/StoryRepository.js';
import { createStoryRoutes } from './routes/storyRoutes.js';

const storyRepository = createStoryRepository({
  getDb,
  persistDb,
});

function getGroqApiKey(): string {
  const key = process.env.GROQ_API_KEY;
  return key ?? '';
}

async function main() {
  await initDatabase();

  const app = express();
  app.use(cors({ origin: true }));
  app.use(express.json());
  app.use(
    '/api',
    createStoryRoutes({
      getGroqApiKey,
      storyRepository,
    }),
  );

  const PORT = process.env.PORT ?? 3000;
  app.listen(PORT, () => {
    console.log(`Backend corriendo en http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error('Error al iniciar:', err);
  process.exit(1);
});
