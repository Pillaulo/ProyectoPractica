import { Router } from 'express';
import type { StoryController } from '../controllers/storyController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export function storyRoutes(controller: StoryController): Router {
  const router = Router();
  router.post('/story', asyncHandler(controller.createStory));
  return router;
}

