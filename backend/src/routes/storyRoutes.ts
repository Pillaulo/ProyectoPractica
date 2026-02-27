// ──────────────────────────────────────────────────────────
//  Capa: Routes
//  Responsabilidad: Declarar los endpoints de la API y
//  conectarlos a los handlers del controller.
// ──────────────────────────────────────────────────────────

import { Router } from 'express';
import { storyController } from '../controllers/storyController';

const router = Router();

router.post('/story', (req, res) => {
  void storyController.generateStory(req, res);
});

router.get('/sessions', storyController.getSessions);

router.get('/sessions/:id', storyController.getSessionById);

export default router;
