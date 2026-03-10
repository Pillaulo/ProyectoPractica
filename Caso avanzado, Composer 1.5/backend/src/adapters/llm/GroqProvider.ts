import Groq from 'groq-sdk';
import { LLMProvider, GenerateStoryParams } from '../../ports/LLMProvider';

const SYSTEM_PROMPT = `Eres un escritor de cuentos infantiles en español.
Genera cuentos cortos, divertidos y apropiados para la edad del niño.
Usa frases simples y vocabulario adecuado al nivel de lectura indicado.
El cuento debe tener un título implícito en la primera frase o empezar con el título.
Formatea el cuento con párrafos separados por líneas en blanco.
No incluyas numeración ni prefijos. Solo texto narrativo.`;

export class GroqProvider implements LLMProvider {
  private readonly client: Groq;
  private readonly model: string;

  constructor(apiKey: string, model = 'llama-3.1-8b-instant') {
    this.client = new Groq({ apiKey });
    this.model = model;
  }

  async generateStory(params: GenerateStoryParams): Promise<string> {
    const themes = params.themes.length > 0
      ? params.themes.map((t) => t.getValue()).join(', ')
      : 'aventuras';

    const variationHint = `Esta debe ser una historia única y creativa. Evita repetir tramas o personajes de cuentos anteriores.`;
    const userPrompt = `Genera un cuento para ${params.readerName}.
Nivel de lectura: ${params.readingLevel.getValue()}.
Temas preferidos: ${themes}.
Longitud aproximada: ${params.maxLength ?? 200} palabras.
El cuento debe estar en español y ser adecuado para lectura infantil.
${variationHint}`;

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 1024,
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) {
      throw new Error('La respuesta del LLM está vacía');
    }

    return content;
  }
}
