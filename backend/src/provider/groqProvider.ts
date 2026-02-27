import { StoryRequest, StoryResponse } from '../types';

export const generateStoryFromGroq = async (request: StoryRequest): Promise<StoryResponse> => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error("GROQ_API_KEY is not defined");
    }

    const prompt = `Escribe un cuento infantil en formato JSON estricto.
El JSON debe tener EXACTAMENTE esta estructura sin texto adicional antes ni después:
{
  "titulo": "string",
  "frases": ["string", "string"],
  "parrafos": ["string", "string"]
}

Detalles del cuento que debes usar:
- Nombre del niño/niña: ${request.nombre_nino}
- Edad: ${request.edad} años
- Tema: ${request.tema}
- Personaje principal: ${request.personaje_principal}
- Nivel de vocabulario: ${request.vocabulario}

Reglas:
1. Las "frases" son oraciones cortas e individuales (al menos 6 frases).
2. Los "parrafos" agrupan secuencialmente esas mismas frases en párrafos completos con sentido narrativo (al menos 2 párrafos).
3. No incluyas explicaciones, responde únicamente con el JSON.
`;

    const fetchWithRetry = async (retries = 1): Promise<StoryResponse> => {
        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        { role: "system", content: "Eres un experto creador de cuentos infantiles. Siempre devuelves un objeto JSON válido y exacto tal como se pide." },
                        { role: "user", content: prompt }
                    ],
                    response_format: { type: "json_object" },
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`Groq API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const content = data.choices[0]?.message?.content;

            if (!content) {
                throw new Error("No content received from Groq");
            }

            const parsed = JSON.parse(content) as StoryResponse;

            if (!parsed.titulo || !Array.isArray(parsed.frases) || !Array.isArray(parsed.parrafos)) {
                throw new Error("Invalid format received from Groq");
            }
            return parsed;

        } catch (error) {
            if (retries > 0) {
                return fetchWithRetry(retries - 1);
            }
            throw error;
        }
    };

    return fetchWithRetry();
};
