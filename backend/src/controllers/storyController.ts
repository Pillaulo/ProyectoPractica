// ──────────────────────────────────────────────────────────
//  Capa: Controller
//  Responsabilidad: Manejar el ciclo HTTP (request/response).
//  Delega validación al validator, lógica al service.
//  Traduce errores de dominio en códigos HTTP estándar.
//  PROHIBIDO: acceder a BD directamente o llamar a Groq.
// ──────────────────────────────────────────────────────────

import { Request, Response } from 'express';
import { storyRequestSchema } from '../validators/storyValidator';
import { storyService } from '../services/storyService';
import { ErrorResponse } from '../types/dto';
import { GroqServiceError, GroqParseError } from '../types/errors';

function sendError(res: Response, status: number, code: string, message: string): void {
  const body: ErrorResponse = { error: { code, message } };
  res.status(status).json(body);
}

export const storyController = {
  async generateStory(req: Request, res: Response): Promise<void> {
    const parsed = storyRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      const message = parsed.error.errors.map((e) => e.message).join('; ');
      sendError(res, 400, 'VALIDATION_ERROR', message);
      return;
    }

    try {
      const story = await storyService.generateAndSave(parsed.data);
      res.status(200).json(story);
    } catch (err) {
      if (err instanceof GroqServiceError) {
        sendError(res, 502, 'GROQ_ERROR', 'Error al comunicarse con el servicio de IA. Inténtalo de nuevo.');
      } else if (err instanceof GroqParseError) {
        sendError(res, 502, 'GROQ_PARSE_ERROR', 'El servicio de IA devolvió una respuesta inválida. Inténtalo de nuevo.');
      } else {
        console.error('[storyController.generateStory] Error inesperado:', err);
        sendError(res, 500, 'INTERNAL_ERROR', 'Error inesperado en el servidor.');
      }
    }
  },

  getSessions(_req: Request, res: Response): void {
    try {
      const sessions = storyService.getSessions();
      res.status(200).json(sessions);
    } catch (err) {
      console.error('[storyController.getSessions] Error:', err);
      sendError(res, 500, 'INTERNAL_ERROR', 'Error al obtener el historial.');
    }
  },

  getSessionById(req: Request, res: Response): void {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      sendError(res, 400, 'VALIDATION_ERROR', 'El ID de sesión debe ser un número entero positivo.');
      return;
    }

    try {
      const session = storyService.getSessionById(id);
      if (!session) {
        sendError(res, 404, 'NOT_FOUND', `No se encontró la sesión con ID ${id}.`);
        return;
      }
      res.status(200).json(session);
    } catch (err) {
      console.error('[storyController.getSessionById] Error:', err);
      sendError(res, 500, 'INTERNAL_ERROR', 'Error al obtener la sesión.');
    }
  },
};
