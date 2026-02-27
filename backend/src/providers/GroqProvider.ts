/**
 * Adapter/Provider para la API de Groq
 * Capa: Infraestructura - solo realiza la llamada HTTP a Groq
 * NO contiene lógica de negocio, solo transporte
 */

const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';
const MODEL = 'llama-3.3-70b-versatile';

export interface GroqChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GroqResponse {
  titulo: string;
  frases: string[];
  parrafos: string[];
}

export class GroqError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = 'GroqError';
  }
}

export async function callGroqApi(
  apiKey: string,
  prompt: string,
): Promise<string> {
  const response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new GroqError(
      `Groq API error: ${response.status} - ${errorBody}`,
      response.status,
    );
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new GroqError('Respuesta vacía de Groq');
  }

  return content;
}
