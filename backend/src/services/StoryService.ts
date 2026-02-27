/**
 * Lógica de aplicación para generación de cuentos
 * Capa: Service (Lógica de negocio)
 * Orquesta provider, validación de salida y repository
 * NO accede a BD ni Groq directamente, usa sus abstracciones
 */

import { callGroqApi, GroqError } from '../providers/GroqProvider.js';
import type { StoryResponse } from '../types/StoryTypes.js';
import type { ValidatedStoryRequest } from '../validators/StoryValidator.js';

const MAX_RETRIES = 1;

function buildPrompt(request: ValidatedStoryRequest): string {
  const nivel =
    request.vocabulario === 'simple'
      ? 'palabras sencillas, frases cortas, vocabulario básico'
      : 'vocabulario algo más rico, frases medianas';

  return `Eres un escritor de cuentos infantiles. Genera un cuento corto para niños de ${request.edad} años.

Datos:
- Niño/a: ${request.nombre_nino}
- Edad: ${request.edad}
- Tema: ${request.tema}
- Personaje principal: ${request.personaje_principal}
- Nivel de vocabulario: ${request.vocabulario} (${nivel})

IMPORTANTE: Responde ÚNICAMENTE con un JSON válido, sin texto adicional, siguiendo exactamente esta estructura:
{
  "titulo": "Título del cuento (string)",
  "frases": ["Frase 1 completa.", "Frase 2 completa.", ...],
  "parrafos": ["Párrafo 1 completo con varias frases.", "Párrafo 2 completo.", ...]
}

- titulo: string con el título
- frases: array de strings, cada uno una frase o oración corta (para lectura frase por frase)
- parrafos: array de strings, cada uno un párrafo completo (2-4 oraciones)

El cuento debe tener entre 8 y 15 frases y entre 3 y 6 párrafos. Asegura coherencia entre frases y párrafos.`;
}

function parseAndNormalize(jsonStr: string): StoryResponse {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    throw new Error('Respuesta de Groq no es JSON válido');
  }

  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('Respuesta de Groq no tiene formato esperado');
  }

  const obj = parsed as Record<string, unknown>;

  const titulo = obj.titulo;
  const frases = obj.frases;
  const parrafos = obj.parrafos;

  if (typeof titulo !== 'string' || !titulo.trim()) {
    throw new Error('Campo titulo inválido o vacío');
  }

  if (!Array.isArray(frases)) {
    throw new Error('Campo frases debe ser un array');
  }

  if (!Array.isArray(parrafos)) {
    throw new Error('Campo parrafos debe ser un array');
  }

  const frasesNormalizadas = frases
    .filter((f): f is string => typeof f === 'string')
    .map((f) => String(f).trim())
    .filter(Boolean);

  const parrafosNormalizados = parrafos
    .filter((p): p is string => typeof p === 'string')
    .map((p) => String(p).trim())
    .filter(Boolean);

  if (frasesNormalizadas.length === 0 || parrafosNormalizados.length === 0) {
    throw new Error('frases o parrafos no pueden estar vacíos');
  }

  return {
    titulo: titulo.trim(),
    frases: frasesNormalizadas,
    parrafos: parrafosNormalizados,
  };
}

export interface StoryServiceDeps {
  getGroqApiKey: () => string;
  storyRepository: import('../repositories/StoryRepository.js').StoryRepositoryInstance;
}

export function createStoryService(deps: StoryServiceDeps) {
  return {
    async generateStory(request: ValidatedStoryRequest): Promise<StoryResponse> {
      const apiKey = deps.getGroqApiKey();
      if (!apiKey) {
        throw new Error('GROQ_API_KEY no configurada');
      }

      const prompt = buildPrompt(request);
      let lastError: Error | null = null;

      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          const rawResponse = await callGroqApi(apiKey, prompt);
          const response = parseAndNormalize(rawResponse);

          deps.storyRepository.save(request, response);
          return response;
        } catch (err) {
          lastError = err instanceof Error ? err : new Error(String(err));
          if (err instanceof GroqError && attempt < MAX_RETRIES) {
            continue;
          }
          throw err;
        }
      }

      throw lastError ?? new Error('Error desconocido generando cuento');
    },
  };
}
