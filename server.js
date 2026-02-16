import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Validación de inputs
function validarInputs(body) {
  const errores = [];

  if (!body.nombre_nino || typeof body.nombre_nino !== 'string') {
    errores.push('nombre_nino es requerido y debe ser un string');
  } else if (body.nombre_nino.trim() === '') {
    errores.push('nombre_nino no puede estar vacío');
  }

  const edad = body.edad;
  if (edad === undefined || edad === null) {
    errores.push('edad es requerido');
  } else {
    const edadNum = Number(edad);
    if (isNaN(edadNum) || edadNum < 5 || edadNum > 9) {
      errores.push('edad debe ser un número entre 5 y 9');
    }
  }

  if (!body.tema || typeof body.tema !== 'string') {
    errores.push('tema es requerido y debe ser un string');
  } else if (body.tema.trim() === '') {
    errores.push('tema no puede estar vacío');
  }

  if (!body.personaje_principal || typeof body.personaje_principal !== 'string') {
    errores.push('personaje_principal es requerido y debe ser un string');
  } else if (body.personaje_principal.trim() === '') {
    errores.push('personaje_principal no puede estar vacío');
  }

  const vocabularioValidos = ['simple', 'medio'];
  if (!body.vocabulario || !vocabularioValidos.includes(body.vocabulario)) {
    errores.push('vocabulario debe ser "simple" o "medio"');
  }

  return errores;
}

// POST /api/story - Genera cuento personalizado
app.post('/api/story', async (req, res) => {
  try {
    const errores = validarInputs(req.body);
    if (errores.length > 0) {
      return res.status(400).json({ error: errores.join('; ') });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      return res.status(500).json({
        error: 'GROQ_API_KEY no está configurada. Define la variable de entorno GROQ_API_KEY.',
      });
    }

    const { nombre_nino, edad, tema, personaje_principal, vocabulario } = req.body;

    const prompt = `Genera un cuento infantil personalizado en español con estos datos:
- Nombre del niño/a: ${nombre_nino}
- Edad: ${edad} años
- Tema del cuento: ${tema}
- Personaje principal: ${personaje_principal}
- Nivel de vocabulario: ${vocabulario}

INSTRUCCIONES ESTRICTAS:
1. El cuento debe ser apropiado para la edad indicada.
2. Con vocabulario "${vocabulario}": usa palabras más cortas y sencillas si es "simple", ligeramente más amplias si es "medio".
3. Devuelve ÚNICAMENTE un objeto JSON válido con exactamente estas claves (sin markdown, sin explicaciones):
{
  "titulo": "string con el título del cuento",
  "frases": ["frase 1", "frase 2", "frase 3", ...],  // entre 8 y 12 frases cortas
  "parrafos": ["párrafo 1 completo", "párrafo 2 completo", ...]  // entre 3 y 5 párrafos
}

Cada frase debe ser una oración completa y corta. Cada párrafo debe ser 2-4 oraciones.
RESPONDE SOLO CON EL JSON.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Eres un escritor de cuentos infantiles. Respondes únicamente con JSON válido.',
          },
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
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error: `Error de la API Groq: ${response.status} - ${errorData.error?.message || response.statusText}`,
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(500).json({ error: 'La API Groq no devolvió contenido' });
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      return res.status(500).json({
        error: 'La respuesta de Groq no es JSON válido',
        raw: content.substring(0, 200),
      });
    }

    // Normalizar y validar estructura
    const titulo = typeof parsed.titulo === 'string' ? parsed.titulo : 'Cuento sin título';
    let frases = Array.isArray(parsed.frases)
      ? parsed.frases.filter((f) => typeof f === 'string').map((f) => String(f).trim()).filter(Boolean)
      : [];
    let parrafos = Array.isArray(parsed.parrafos)
      ? parsed.parrafos.filter((p) => typeof p === 'string').map((p) => String(p).trim()).filter(Boolean)
      : [];

    // Ajustar rangos si Groq no los respetó
    if (frases.length < 8 && parrafos.length > 0) {
      frases = parrafos.flatMap((p) =>
        p.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean)
      ).slice(0, 12);
    }
    if (parrafos.length < 3 && frases.length > 0) {
      const chunkSize = Math.ceil(frases.length / 4);
      parrafos = [];
      for (let i = 0; i < frases.length; i += chunkSize) {
        parrafos.push(frases.slice(i, i + chunkSize).join('. ') + '.');
      }
    }
    if (frases.length < 8) frases = [...frases, ...Array(8 - frases.length).fill('...')].slice(0, 12);
    if (parrafos.length < 3) parrafos = [...parrafos, '...'].slice(0, 5);

    return res.json({
      titulo,
      frases: frases.slice(0, 12),
      parrafos: parrafos.slice(0, 5),
    });
  } catch (err) {
    console.error('Error en /api/story:', err);
    return res.status(500).json({
      error: err.message || 'Error interno del servidor',
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, groqConfigured: !!process.env.GROQ_API_KEY });
});

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
