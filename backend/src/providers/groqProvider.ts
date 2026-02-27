// ──────────────────────────────────────────────────────────
//  Capa: Provider / Adapter
//  Responsabilidad: Encapsular TODA comunicación con la API
//  externa de Groq. Construye el prompt, hace la llamada HTTP
//  y valida la estructura de respuesta.
//  El service NO conoce detalles de Groq.
// ──────────────────────────────────────────────────────────

import axios from 'axios';
import { GroqServiceError, GroqParseError } from '../types/errors';

const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';
const MODEL = 'llama-3.3-70b-versatile';

export interface GroqStoryInput {
  nombre_nino: string;
  edad: number;
  tema: string;
  personaje_principal: string;
  vocabulario: 'simple' | 'medio';
}

export interface GroqStoryOutput {
  titulo: string;
  frases: string[];
  parrafos: string[];
}

function buildPrompt(input: GroqStoryInput): string {
  const nivelDesc =
    input.vocabulario === 'simple'
      ? 'muy simple y básico, palabras cortas y comunes'
      : 'intermedio, con palabras algo más elaboradas pero comprensibles';

  return `Eres un escritor de cuentos infantiles en español. Genera un cuento personalizado para niños.

IMPORTANTE: Responde ÚNICAMENTE con un objeto JSON válido. Sin texto adicional, sin explicaciones, sin bloques de código markdown.

El JSON debe tener EXACTAMENTE esta estructura:
{
  "titulo": "título del cuento (máximo 8 palabras)",
  "frases": ["oración 1", "oración 2", "..."],
  "parrafos": ["párrafo 1", "párrafo 2", "..."]
}

Parámetros del cuento:
- Nombre del niño/niña: ${input.nombre_nino}
- Edad: ${input.edad} años
- Tema: ${input.tema}
- Personaje principal: ${input.personaje_principal}
- Nivel de vocabulario: ${nivelDesc}

Reglas:
- Menciona el nombre "${input.nombre_nino}" al menos una vez en el cuento
- "frases": entre 10 y 15 oraciones cortas y simples del cuento (cada oración es un elemento del array)
- "parrafos": entre 3 y 5 párrafos que narren el cuento completo
- El cuento debe ser positivo, imaginativo y apropiado para niños de ${input.edad} años
- Responde SOLO con el JSON, absolutamente nada más`;
}

function parseGroqResponse(content: string): GroqStoryOutput {
  let text = content.trim();

  // Eliminar bloques markdown si el modelo los incluyó igualmente
  const markdownMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (markdownMatch) {
    text = markdownMatch[1].trim();
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new GroqParseError('La respuesta de Groq no es JSON válido');
  }

  const obj = parsed as Record<string, unknown>;

  if (
    typeof obj.titulo !== 'string' ||
    !Array.isArray(obj.frases) ||
    !Array.isArray(obj.parrafos) ||
    obj.frases.length === 0 ||
    obj.parrafos.length === 0
  ) {
    throw new GroqParseError('La estructura JSON de Groq no es la esperada');
  }

  return {
    titulo: obj.titulo,
    frases: obj.frases as string[],
    parrafos: obj.parrafos as string[],
  };
}

async function callGroqOnce(prompt: string): Promise<GroqStoryOutput> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new GroqServiceError('GROQ_API_KEY no está configurada en las variables de entorno');
  }

  const response = await axios.post(
    `${GROQ_BASE_URL}/chat/completions`,
    {
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2048,
      response_format: { type: 'json_object' },
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30_000,
    },
  );

  const content: string | undefined = response.data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new GroqParseError('Groq devolvió una respuesta vacía');
  }

  return parseGroqResponse(content);
}

export const groqProvider = {
  async generateStory(input: GroqStoryInput): Promise<GroqStoryOutput> {
    const prompt = buildPrompt(input);
    try {
      return await callGroqOnce(prompt);
    } catch (firstErr) {
      // Si es un error de parse o red, reintentamos una vez
      if (firstErr instanceof GroqParseError || axios.isAxiosError(firstErr)) {
        try {
          return await callGroqOnce(prompt);
        } catch (secondErr) {
          if (axios.isAxiosError(secondErr)) {
            throw new GroqServiceError(
              `Error de red con Groq: ${secondErr.message}`,
            );
          }
          throw secondErr;
        }
      }
      throw firstErr;
    }
  },
};
