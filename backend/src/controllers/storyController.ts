import type { Request, Response } from 'express';
import { ApiError } from '../errors/apiError.js';
import { storyRequestSchema } from '../validators/storyValidator.js';
import type { StoryService } from '../services/storyService.js';

export class StoryController {
  constructor(private readonly service: StoryService) {}

  createStory = async (req: Request, res: Response) => {
    const parsed = storyRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? 'Datos inválidos.';
      throw new ApiError(400, 'VALIDATION_ERROR', message);
    }

    const story = await this.service.generateAndSaveStory(parsed.data);
    res.json(story);
  };
}

