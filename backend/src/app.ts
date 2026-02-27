// ──────────────────────────────────────────────────────────
//  Configuración de la aplicación Express
//  Responsabilidad: Montar middlewares globales y rutas.
//  Separado de index.ts para facilitar pruebas unitarias.
// ──────────────────────────────────────────────────────────

import express from 'express';
import cors from 'cors';
import storyRoutes from './routes/storyRoutes';

const app = express();

// ── CORS ────────────────────────────────────────────────────
const allowedOrigin = process.env.FRONTEND_URL ?? 'http://localhost:5173';

app.use(
  cors({
    origin: allowedOrigin,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  }),
);

// ── Body parsing ─────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));

// ── Rutas de la API ───────────────────────────────────────────
app.use('/api', storyRoutes);

// ── Health check ──────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── 404 handler ───────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Ruta no encontrada.' } });
});

export default app;
