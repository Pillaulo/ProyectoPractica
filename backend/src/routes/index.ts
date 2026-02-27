import { Router } from 'express';
import { generateStoryHandler } from '../controller/storyController';
import { getSessionsHandler, getSessionByIdHandler } from '../controller/sessionController';

const router = Router();

// Endpoint principal
router.post('/story', generateStoryHandler);

// Endpoints Historial (OBLIGATORIO)
router.get('/sessions', getSessionsHandler);
router.get('/sessions/:id', getSessionByIdHandler);

export default router;
