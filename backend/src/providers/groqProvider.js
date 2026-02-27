const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';
const MODEL = 'llama-3.3-70b-versatile';

function buildPrompt(request) {
  const nivelVocabulario =
    request.vocabulario === 'simple'
      ? 'Usa palabras muy sencillas, frases cortas y lenguaje básico para niños pequeños.'
      : 'Usa vocabulario moderado, apropiado para niños que ya leen con cierta fluidez.';

  return `Eres un escritor de cuentos infantiles. Genera un cuento para un niño llamado ${request.nombre_nino} de ${request.edad} años.

Tema del cuento: ${request.tema}
Personaje principal: ${request.personaje_principal}
${nivelVocabulario}

INSTRUCCIONES ESTRICTAS DE FORMATO:
- Responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional antes ni después.
- El JSON debe tener exactamente esta estructura:
{
  "titulo": "Título del cuento",
  "frases": ["Frase 1.", "Frase 2.", "Frase 3.", ...],
  "parrafos": ["Párrafo 1 completo.", "Párrafo 2 completo.", ...]
}
- "frases" debe contener entre 10 y 20 frases cortas que compongan el cuento.
- "parrafos" debe contener entre 3 y 6 párrafos que cuenten la misma historia agrupada.
- No incluyas markdown, comentarios ni explicaciones. Solo el JSON.`;
}

async function generateStory(request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY no está configurada en las variables de entorno');
  }

  const prompt = buildPrompt(request);

  const body = JSON.stringify({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 2048,
    response_format: { type: 'json_object' },
  });

  let lastError = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq API respondió con status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('La respuesta de Groq no contiene contenido');
      }

      const parsed = JSON.parse(content);

      if (
        typeof parsed.titulo !== 'string' ||
        !Array.isArray(parsed.frases) ||
        !Array.isArray(parsed.parrafos) ||
        parsed.frases.length === 0 ||
        parsed.parrafos.length === 0
      ) {
        throw new Error('El JSON de Groq no tiene la estructura esperada');
      }

      return {
        titulo: parsed.titulo,
        frases: parsed.frases,
        parrafos: parsed.parrafos,
      };
    } catch (err) {
      lastError = err;
    }
  }

  const error = new Error(`Error al generar cuento con Groq: ${lastError.message}`);
  error.isGroqError = true;
  throw error;
}

module.exports = { generateStory };
