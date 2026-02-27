/**
 * Definición de rutas para API de cuentos
 * Capa: Routes
 */

import { Router } from 'express';
import type { StoryControllerDeps } from '../controllers/StoryController.js';
import { createStoryController } from '../controllers/StoryController.js';

export function createStoryRoutes(deps: StoryControllerDeps): Router {
  const router = Router();
  const controller = createStoryController(deps);

  router.post('/story', (req, res) => controller.postStory(req, res));
  router.get('/sessions', (req, res) => controller.getSessions(req, res));
  router.get('/sessions/:id', (req, res) => controller.getSessionById(req, res));

  return router;
}
