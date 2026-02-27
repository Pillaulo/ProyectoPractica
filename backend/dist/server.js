import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { toErrorResponse, ApiError } from './errors/apiError.js';
import { loadEnv } from './utils/env.js';
import { SqliteDb } from './infrastructure/db/sqliteDb.js';
import { StorySessionRepository } from './repositories/storySessionRepository.js';
import { GroqProvider } from './providers/groq/groqProvider.js';
import { StoryService } from './services/storyService.js';
import { StoryController } from './controllers/storyController.js';
import { SessionsController } from './controllers/sessionsController.js';
import { storyRoutes } from './routes/storyRoutes.js';
import { sessionsRoutes } from './routes/sessionsRoutes.js';
dotenv.config();
async function main() {
    const env = loadEnv();
    const sqlite = new SqliteDb(env.DATABASE_URL);
    const repo = new StorySessionRepository(sqlite);
    await repo.init();
    const groq = new GroqProvider(env.GROQ_API_KEY, 'llama-3.3-70b-versatile');
    const service = new StoryService(groq, repo);
    const storyController = new StoryController(service);
    const sessionsController = new SessionsController(service);
    const app = express();
    app.use(express.json({ limit: '1mb' }));
    app.use(cors({
        origin: ['http://localhost:5173'],
        methods: ['GET', 'POST'],
    }));
    app.get('/health', (_req, res) => res.json({ ok: true }));
    app.use('/api', storyRoutes(storyController));
    app.use('/api', sessionsRoutes(sessionsController));
    // 404 simple para rutas de API desconocidas
    app.use('/api', (_req, _res, next) => next(new ApiError(404, 'NOT_FOUND', 'Ruta no encontrada.')));
    // Error handler estándar
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.use((err, _req, res, _next) => {
        // Error típico por JSON inválido en body
        if (err?.type === 'entity.parse.failed') {
            const out = toErrorResponse(new ApiError(400, 'VALIDATION_ERROR', 'JSON inválido.'));
            return res.status(out.status).json(out.body);
        }
        const out = toErrorResponse(err);
        return res.status(out.status).json(out.body);
    });
    app.listen(env.PORT, () => {
        // No loguear secretos
        console.log(`Backend listo en http://localhost:${env.PORT}`);
    });
}
main().catch((err) => {
    const out = toErrorResponse(err);
    console.error(out.body.error);
    process.exit(1);
});
//# sourceMappingURL=server.js.map