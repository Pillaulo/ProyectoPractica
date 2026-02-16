require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Validation helper
const validateStoryRequest = (body) => {
    const { nombre_nino, edad, tema, personaje_principal, vocabulario } = body;
    const errors = [];

    if (!nombre_nino || typeof nombre_nino !== 'string' || nombre_nino.trim() === '') errors.push("nombre_nino is required");
    if (!edad || typeof edad !== 'number' || edad < 5 || edad > 9) errors.push("Edad valid range: 5-9");
    if (!tema || typeof tema !== 'string' || tema.trim() === '') errors.push("tema is required");
    if (!personaje_principal || typeof personaje_principal !== 'string' || personaje_principal.trim() === '') errors.push("personaje_principal is required");
    if (!['simple', 'medio'].includes(vocabulario)) errors.push("vocabulario must be 'simple' or 'medio'");

    return errors;
};

// Endpoint
app.post('/api/story', async (req, res) => {
    const errors = validateStoryRequest(req.body);
    if (errors.length > 0) {
        return res.status(400).json({ error: "Validation Error", details: errors });
    }

    const { nombre_nino, edad, tema, personaje_principal, vocabulario } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        console.error("GROQ_API_KEY missing");
        return res.status(500).json({ error: "Server configuration error: GROQ_API_KEY missing" });
    }

    const systemPrompt = `Eres un asistente experto en crear cuentos infantiles personalizados.
Genera un cuento corto adecuado para un niño de ${edad} años.
El vocabulario debe ser ${vocabulario}.
La respuesta DEBE ser exclusivamente un JSON válido con la siguiente estructura estricta:
{
  "titulo": "string",
  "frases": ["string", "string", ...], // Entre 8 y 12 frases cortas que formen la historia completa.
  "parrafos": ["string", "string", ...] // La misma historia dividida en 3 a 5 párrafos.
}
No incluyas nada más que el JSON.`;

    const userPrompt = `Crea un cuento sobre "${tema}" donde el protagonista es "${personaje_principal}" y el niño se llama "${nombre_nino}".`;

    try {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            temperature: 0.7,
            response_format: { type: "json_object" } // Force JSON mode if supported strictly, or rely on prompt
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const content = response.data.choices[0].message.content;
        let storyData;
        try {
            storyData = JSON.parse(content);
        } catch (e) {
            console.error("Failed to parse JSON from Groq:", content);
            return res.status(502).json({ error: "Invalid response format from AI provider" });
        }

        // Validate structure of response
        if (!storyData.titulo || !Array.isArray(storyData.frases) || !Array.isArray(storyData.parrafos)) {
             return res.status(502).json({ error: "AI response missing required fields" });
        }

        res.json(storyData);

    } catch (error) {
        console.error("Error generating story:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to generate story", details: error.response?.data || error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
