import { Request, Response, NextFunction } from 'express';
import { listRecentSessions, fetchSessionById } from '../service/sessionService';

export const getSessionsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sessions = await listRecentSessions();
        res.status(200).json(sessions);
    } catch (error) {
        next(error);
    }
};

export const getSessionByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id as string, 10);
        if (isNaN(id)) {
            return next({
                status: 400,
                code: 'VALIDATION_ERROR',
                message: 'Invalid ID format'
            });
        }

        const session = await fetchSessionById(id);
        if (!session) {
            return next({
                status: 404,
                code: 'NOT_FOUND',
                message: 'Sesión no encontrada'
            });
        }

        res.status(200).json(session);
    } catch (error) {
        next(error);
    }
};
