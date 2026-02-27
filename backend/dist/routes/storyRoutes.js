import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
export function storyRoutes(controller) {
    const router = Router();
    router.post('/story', asyncHandler(controller.createStory));
    return router;
}
//# sourceMappingURL=storyRoutes.js.map