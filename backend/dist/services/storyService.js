import { z } from 'zod';
import { ApiError } from '../errors/apiError.js';
const storyResponseSchema = z.object({
    titulo: z.string().trim().min(1),
    frases: z.array(z.string().trim().min(1)).min(1),
    parrafos: z.array(z.string().trim().min(1)).min(1),
});
function buildPrompt(input) {
    const system = [
        'Eres un asistente que crea cuentos infantiles para niños de 5 a 9 años.',
        'Debes responder SIEMPRE con JSON estricto, sin markdown, sin texto adicional.',
        'El JSON debe tener exactamente estas claves: "titulo" (string), "frases" (array de strings), "parrafos" (array de strings).',
    ].join('\n');
    const user = [
        `Crea un cuento personalizado para:`,
        `- nombre_nino: ${input.nombre_nino}`,
        `- edad: ${input.edad}`,
        `- tema: ${input.tema}`,
        `- personaje_principal: ${input.personaje_principal}`,
        `- vocabulario: ${input.vocabulario} (simple o medio según se indique)`,
        '',
        'Requisitos de salida:',
        '- titulo: un título corto y alegre.',
        '- frases: 8 frases cortas, separadas (sin numeración).',
        '- parrafos: 4 párrafos cortos (sin numeración).',
        '',
        'Responde solo el JSON.',
    ].join('\n');
    return { system, user };
}
function safeParseStoryJson(content) {
    try {
        const parsed = JSON.parse(content);
        const result = storyResponseSchema.safeParse(parsed);
        if (!result.success)
            return null;
        return result.data;
    }
    catch {
        return null;
    }
}
export class StoryService {
    groq;
    repo;
    constructor(groq, repo) {
        this.groq = groq;
        this.repo = repo;
    }
    async generateAndSaveStory(input) {
        const { system, user } = buildPrompt(input);
        const attempt = async () => {
            const { content } = await this.groq.chatCompletion({
                messages: [
                    { role: 'system', content: system },
                    { role: 'user', content: user },
                ],
                temperature: 0.7,
            });
            return safeParseStoryJson(content);
        };
        let story = null;
        try {
            story = await attempt();
            if (!story)
                story = await attempt();
        }
        catch (e) {
            throw new ApiError(502, 'GROQ_ERROR', 'Error al generar el cuento (Groq/red).');
        }
        if (!story) {
            throw new ApiError(502, 'GROQ_ERROR', 'Groq devolvió un JSON inválido.');
        }
        try {
            await this.repo.createSession(input, story);
        }
        catch {
            throw new ApiError(500, 'INTERNAL_ERROR', 'No se pudo guardar el historial.');
        }
        return story;
    }
    async listSessions() {
        try {
            return await this.repo.listSessions(10);
        }
        catch {
            throw new ApiError(500, 'INTERNAL_ERROR', 'No se pudo leer el historial.');
        }
    }
    async getSession(id) {
        const session = await this.repo.getSessionById(id);
        if (!session)
            throw new ApiError(404, 'NOT_FOUND', 'Sesión no encontrada.');
        return session;
    }
}
//# sourceMappingURL=storyService.js.map