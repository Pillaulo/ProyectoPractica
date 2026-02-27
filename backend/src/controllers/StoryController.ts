/**
 * Controller para endpoints de cuentos e historial
 * Capa: Controller (orquesta request/response)
 * NO accede a BD ni Groq, usa Service y Repository
 */

import type { Request, Response } from 'express';
import { StoryRequestSchema } from '../validators/StoryValidator.js';
import { GroqError } from '../providers/GroqProvider.js';
import type { StoryServiceDeps } from '../services/StoryService.js';
import { createStoryService } from '../services/StoryService.js';
import type { StoryRepositoryInstance } from '../repositories/StoryRepository.js';

export interface StoryControllerDeps {
  getGroqApiKey: () => string;
  storyRepository: StoryRepositoryInstance;
}

function sendError(res: Response, code: number, errorCode: string, message: string) {
  res.status(code).json({
    error: { code: errorCode, message },
  });
}

export function createStoryController(deps: StoryControllerDeps) {
  const storyService = createStoryService({
    getGroqApiKey: deps.getGroqApiKey,
    storyRepository: deps.storyRepository,
  });

  return {
    async postStory(req: Request, res: Response): Promise<void> {
      const parsed = StoryRequestSchema.safeParse(req.body);

      if (!parsed.success) {
        const msg = parsed.error.errors.map((e) => e.message).join('; ');
        sendError(res, 400, 'VALIDATION_ERROR', msg);
        return;
      }

      try {
        const response = await storyService.generateStory(parsed.data);
        res.status(200).json(response);
      } catch (err) {
        if (err instanceof GroqError) {
          sendError(res, 502, 'GROQ_ERROR', err.message);
          return;
        }
        if (err instanceof SyntaxError || (err instanceof Error && err.message.includes('JSON'))) {
          sendError(res, 502, 'GROQ_ERROR', 'Respuesta de IA inválida');
          return;
        }
        console.error('postStory error:', err);
        sendError(res, 500, 'INTERNAL_ERROR', 'Error inesperado del servidor');
      }
    },

    async getSessions(req: Request, res: Response): Promise<void> {
      try {
        const sessions = await deps.storyRepository.findLatest(20);
        res.status(200).json(sessions);
      } catch (err) {
        console.error('getSessions error:', err);
        sendError(res, 500, 'INTERNAL_ERROR', 'Error al obtener historial');
      }
    },

    async getSessionById(req: Request, res: Response): Promise<void> {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        sendError(res, 400, 'VALIDATION_ERROR', 'id inválido');
        return;
      }

      try {
        const session = await deps.storyRepository.findById(id);
        if (!session) {
          sendError(res, 404, 'NOT_FOUND', 'Sesión no encontrada');
          return;
        }
        res.status(200).json(session);
      } catch (err) {
        console.error('getSessionById error:', err);
        sendError(res, 500, 'INTERNAL_ERROR', 'Error al obtener sesión');
      }
    },
  };
}
