// ──────────────────────────────────────────────────────────
//  Capa: Service (Lógica de aplicación)
//  Responsabilidad: Orquestar la generación de cuentos:
//  invoca al provider para obtener el cuento y al repository
//  para persistirlo. No conoce detalles HTTP ni de BD.
// ──────────────────────────────────────────────────────────

import { groqProvider } from '../providers/groqProvider';
import { sessionRepository } from '../repositories/sessionRepository';
import { StoryRequest, StoryResponse, SessionSummary, SessionDetail } from '../types/dto';

export const storyService = {
  async generateAndSave(request: StoryRequest): Promise<StoryResponse> {
    const groqResult = await groqProvider.generateStory({
      nombre_nino: request.nombre_nino,
      edad: request.edad,
      tema: request.tema,
      personaje_principal: request.personaje_principal,
      vocabulario: request.vocabulario,
    });

    const story: StoryResponse = {
      titulo: groqResult.titulo,
      frases: groqResult.frases,
      parrafos: groqResult.parrafos,
    };

    sessionRepository.save(request, story);

    return story;
  },

  getSessions(): SessionSummary[] {
    return sessionRepository.findAll(20);
  },

  getSessionById(id: number): SessionDetail | null {
    return sessionRepository.findById(id);
  },
};
