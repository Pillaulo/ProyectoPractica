import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
export function sessionsRoutes(controller) {
    const router = Router();
    router.get('/sessions', asyncHandler(controller.listSessions));
    router.get('/sessions/:id', asyncHandler(controller.getSession));
    return router;
}
//# sourceMappingURL=sessionsRoutes.js.map