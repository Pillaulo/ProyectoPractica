import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Validate that GROQ_API_KEY is set
if (!process.env.GROQ_API_KEY) {
  console.error('ERROR: GROQ_API_KEY environment variable is not set');
  console.error('Please create a .env file with GROQ_API_KEY=your_api_key');
  process.exit(1);
}

// POST /api/story - Generate a personalized story
app.post('/api/story', async (req, res) => {
  try {
    // Extract and validate inputs
    const { nombre_nino, edad, tema, personaje_principal, vocabulario } = req.body;

    // Validation
    const errors = [];
    
    if (!nombre_nino || typeof nombre_nino !== 'string' || nombre_nino.trim() === '') {
      errors.push('nombre_nino is required and must be a non-empty string');
    }
    
    if (!edad || typeof edad !== 'number' || edad < 5 || edad > 9) {
      errors.push('edad is required and must be a number between 5 and 9');
    }
    
    if (!tema || typeof tema !== 'string' || tema.trim() === '') {
      errors.push('tema is required and must be a non-empty string');
    }
    
    if (!personaje_principal || typeof personaje_principal !== 'string' || personaje_principal.trim() === '') {
      errors.push('personaje_principal is required and must be a non-empty string');
    }
    
    if (!vocabulario || !['simple', 'medio'].includes(vocabulario)) {
      errors.push('vocabulario is required and must be either "simple" or "medio"');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }

    // Build prompt for Groq
    const vocabularioDesc = vocabulario === 'simple' 
      ? 'vocabulario muy simple y palabras cortas' 
      : 'vocabulario moderado apropiado para la edad';

    const prompt = `Eres un escritor de cuentos infantiles. Crea un cuento personalizado con estas características:

- Nombre del niño/a: ${nombre_nino}
- Edad: ${edad} años
- Tema: ${tema}
- Personaje principal: ${personaje_principal}
- Nivel de vocabulario: ${vocabularioDesc}

IMPORTANTE: Debes responder ÚNICAMENTE con un objeto JSON válido (sin markdown, sin bloques de código) con esta estructura exacta:
{
  "titulo": "título del cuento",
  "frases": ["frase 1", "frase 2", ..., "frase N"],
  "parrafos": ["párrafo 1", "párrafo 2", ..., "párrafo M"]
}

Requisitos:
- El array "frases" debe tener entre 8 y 12 frases cortas y simples
- El array "parrafos" debe tener entre 3 y 5 párrafos
- Cada frase debe ser una oración completa y comprensible por sí sola
- Los párrafos deben agrupar las frases de forma coherente
- El cuento debe ser apropiado para un niño de ${edad} años
- Incluye al niño/a (${nombre_nino}) como protagonista o parte de la historia
- Usa el nivel de vocabulario: ${vocabularioDesc}

Responde SOLO con el JSON, sin texto adicional.`;

    // Call Groq API
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Eres un asistente que responde ÚNICAMENTE con JSON válido, sin markdown ni bloques de código.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000
      })
    });

    if (!groqResponse.ok) {
      const errorData = await groqResponse.text();
      console.error('Groq API error:', errorData);
      return res.status(500).json({
        error: 'Error calling Groq API',
        details: `Status ${groqResponse.status}: ${errorData}`
      });
    }

    const groqData = await groqResponse.json();
    
    // Extract the content from Groq response
    const content = groqData.choices?.[0]?.message?.content;
    
    if (!content) {
      return res.status(500).json({
        error: 'Invalid response from Groq API',
        details: 'No content in response'
      });
    }

    // Parse the JSON response
    let storyData;
    try {
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      storyData = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Content received:', content);
      return res.status(500).json({
        error: 'Failed to parse story JSON',
        details: 'The AI response was not valid JSON',
        rawContent: content
      });
    }

    // Validate the structure
    if (!storyData.titulo || !Array.isArray(storyData.frases) || !Array.isArray(storyData.parrafos)) {
      return res.status(500).json({
        error: 'Invalid story structure',
        details: 'Missing required fields: titulo, frases, or parrafos'
      });
    }

    // Validate array lengths
    if (storyData.frases.length < 8 || storyData.frases.length > 12) {
      console.warn(`Warning: frases array has ${storyData.frases.length} items (expected 8-12)`);
    }
    
    if (storyData.parrafos.length < 3 || storyData.parrafos.length > 5) {
      console.warn(`Warning: parrafos array has ${storyData.parrafos.length} items (expected 3-5)`);
    }

    // Return normalized response
    res.json({
      titulo: storyData.titulo,
      frases: storyData.frases,
      parrafos: storyData.parrafos
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Story backend is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ GROQ_API_KEY is configured`);
  console.log(`📚 Ready to generate stories!`);
});
