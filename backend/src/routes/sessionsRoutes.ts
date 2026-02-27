import { Router } from 'express';
import type { SessionsController } from '../controllers/sessionsController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export function sessionsRoutes(controller: SessionsController): Router {
  const router = Router();
  router.get('/sessions', asyncHandler(controller.listSessions));
  router.get('/sessions/:id', asyncHandler(controller.getSession));
  return router;
}

