const { parseStoryResponse } = require("../types/storyDto");
const { AppError } = require("../utils/appError");

class StoryService {
  constructor({ groqProvider, storySessionRepository }) {
    this.groqProvider = groqProvider;
    this.storySessionRepository = storySessionRepository;
  }

  async createStorySession(input) {
    const prompt = this.buildPrompt(input);
    const story = await this.requestValidStory(prompt);

    await this.storySessionRepository.createSession(input, story);
    return story;
  }

  async listSessions() {
    return this.storySessionRepository.listSessions(20);
  }

  async getSessionDetail(sessionId) {
    const session = await this.storySessionRepository.findSessionById(sessionId);

    if (!session) {
      throw new AppError(404, "NOT_FOUND", "Sesion no encontrada.");
    }

    return session;
  }

  async requestValidStory(prompt) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const rawContent = await this.groqProvider.generateStory(prompt);
        const parsedJson = this.tryParseJson(rawContent);
        return parseStoryResponse(parsedJson);
      } catch (error) {
        if (attempt === 1) {
          throw new AppError(
            502,
            "GROQ_ERROR",
            "No fue posible generar un cuento valido en este momento."
          );
        }
      }
    }

    throw new AppError(
      502,
      "GROQ_ERROR",
      "No fue posible generar un cuento valido en este momento."
    );
  }

  tryParseJson(text) {
    try {
      return JSON.parse(text);
    } catch (_firstError) {
      const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
      if (fenced?.[1]) {
        return JSON.parse(fenced[1]);
      }
      throw new Error("JSON invalido");
    }
  }

  buildPrompt(input) {
    return `
Genera un cuento infantil personalizado.
Debes responder EXCLUSIVAMENTE JSON estricto y valido, sin markdown, sin texto adicional.
Usa este formato exacto:
{
  "titulo": "string",
  "frases": ["string", "string"],
  "parrafos": ["string", "string"]
}

Reglas:
- Lenguaje apropiado para ninos entre 5 y 9 anos.
- Incluye al personaje principal indicado.
- Tema principal: ${input.tema}
- Nombre del nino: ${input.nombre_nino}
- Edad: ${input.edad}
- Nivel de vocabulario: ${input.vocabulario}
- Genera minimo 6 frases y minimo 3 parrafos.
- El titulo debe ser breve y positivo.
- El personaje principal es: ${input.personaje_principal}
`.trim();
  }
}

module.exports = {
  StoryService,
};
