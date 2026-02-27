import type { Request, Response } from 'express';
import { ApiError } from '../errors/apiError.js';
import type { StoryService } from '../services/storyService.js';

export class SessionsController {
  constructor(private readonly service: StoryService) {}

  listSessions = async (_req: Request, res: Response) => {
    const items = await this.service.listSessions();
    res.json(items);
  };

  getSession = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'id inválido.');
    }
    const session = await this.service.getSession(id);
    res.json(session);
  };
}

