import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(
  cors({
    origin: true
  })
);

function badRequest(res, message, details) {
  return res.status(400).json({
    error: {
      message,
      details: details ?? null
    }
  });
}

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function normalizeWhitespace(s) {
  return String(s).replace(/\s+/g, ' ').trim();
}

function clampArray(arr, min, max) {
  if (!Array.isArray(arr)) return null;
  const cleaned = arr
    .map((x) => (typeof x === 'string' ? normalizeWhitespace(x) : ''))
    .filter((x) => x.length > 0);
  if (cleaned.length < min) return null;
  return cleaned.slice(0, max);
}

function extractJsonObject(text) {
  if (typeof text !== 'string') return null;
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    // Try to extract first JSON object block.
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');
    if (start >= 0 && end > start) {
      const candidate = trimmed.slice(start, end + 1);
      try {
        return JSON.parse(candidate);
      } catch {
        return null;
      }
    }
    return null;
  }
}

async function groqChatCompletion({ model, messages, temperature = 0.7 }) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    const err = new Error('Falta la variable de entorno GROQ_API_KEY en el backend.');
    err.statusCode = 500;
    throw err;
  }

  const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      response_format: { type: 'json_object' }
    })
  });

  const text = await resp.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    const err = new Error('Respuesta no-JSON desde Groq.');
    err.statusCode = 502;
    err.details = { raw: text.slice(0, 4000) };
    throw err;
  }

  if (!resp.ok) {
    const err = new Error(
      data?.error?.message || `Error desde Groq (HTTP ${resp.status}).`
    );
    err.statusCode = 502;
    err.details = data?.error ?? data;
    throw err;
  }

  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    const err = new Error('Groq no devolvió contenido en choices[0].message.content.');
    err.statusCode = 502;
    err.details = data;
    throw err;
  }
  return content;
}

app.post('/api/story', async (req, res) => {
  const {
    nombre_nino,
    edad,
    tema,
    personaje_principal,
    vocabulario
  } = req.body ?? {};

  const errors = {};

  if (!isNonEmptyString(nombre_nino)) errors.nombre_nino = 'Debe ser un string no vacío.';
  const edadNum = Number(edad);
  if (!Number.isInteger(edadNum) || edadNum < 5 || edadNum > 9)
    errors.edad = 'Debe ser un entero entre 5 y 9.';
  if (!isNonEmptyString(tema)) errors.tema = 'Debe ser un string no vacío.';
  if (!isNonEmptyString(personaje_principal))
    errors.personaje_principal = 'Debe ser un string no vacío.';
  if (vocabulario !== 'simple' && vocabulario !== 'medio')
    errors.vocabulario = 'Debe ser "simple" o "medio".';

  if (Object.keys(errors).length > 0) {
    return badRequest(res, 'Validación fallida.', errors);
  }

  const model = 'llama-3.3-70b-versatile';

  const system = [
    'Eres un escritor/a infantil y pedagogo/a. Genera un cuento personalizado para apoyar lectura infantil.',
    'REGLAS ESTRICTAS DE SALIDA: responde SOLO con JSON válido (sin markdown, sin backticks, sin texto extra).',
    'El JSON debe tener EXACTAMENTE estas claves: "titulo", "frases", "parrafos".',
    '"titulo" es string.',
    '"frases" es un array de 8 a 12 strings, cada string una frase corta y clara.',
    '"parrafos" es un array de 3 a 5 strings, cada string un párrafo breve.',
    'No incluyas saltos de línea dentro de una frase; evita comillas raras; usa español neutro.',
    'Ajusta el nivel de vocabulario según el parámetro.'
  ].join('\n');

  const user = [
    `Nombre del niño/a: ${normalizeWhitespace(nombre_nino)}`,
    `Edad: ${edadNum}`,
    `Tema del cuento: ${normalizeWhitespace(tema)}`,
    `Personaje principal: ${normalizeWhitespace(personaje_principal)}`,
    `Nivel de vocabulario (simple|medio): ${vocabulario}`
  ].join('\n');

  try {
    const content = await groqChatCompletion({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ],
      temperature: 0.7
    });

    const parsed = extractJsonObject(content);
    if (!parsed || typeof parsed !== 'object') {
      return res.status(502).json({
        error: {
          message:
            'Groq devolvió un formato inesperado (no se pudo parsear JSON).',
          details: { sample: String(content).slice(0, 2000) }
        }
      });
    }

    const titulo =
      typeof parsed.titulo === 'string' ? normalizeWhitespace(parsed.titulo) : '';
    const frases = clampArray(parsed.frases, 8, 12);
    const parrafos = clampArray(parsed.parrafos, 3, 5);

    if (!titulo || !frases || !parrafos) {
      return res.status(502).json({
        error: {
          message:
            'Groq devolvió JSON pero no cumple el contrato esperado (titulo/frases/parrafos).',
          details: {
            titulo_ok: Boolean(titulo),
            frases_len: Array.isArray(parsed.frases) ? parsed.frases.length : null,
            parrafos_len: Array.isArray(parsed.parrafos) ? parsed.parrafos.length : null
          }
        }
      });
    }

    return res.json({ titulo, frases, parrafos });
  } catch (e) {
    const status = Number(e?.statusCode) || 500;
    const message =
      e?.message ||
      'Error inesperado al generar el cuento. Revisa el backend.';
    return res.status(status).json({
      error: {
        message,
        details: e?.details ?? null
      }
    });
  }
});

const port = Number(process.env.PORT) || 8787;
app.listen(port, () => {
  console.log(`Backend listo en http://localhost:${port}`);
});

