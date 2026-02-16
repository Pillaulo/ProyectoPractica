require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Validación de la API Key al arrancar ────────────────────
const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) {
  console.error(
    "ERROR: La variable de entorno GROQ_API_KEY no está definida.\n" +
      "Define la variable antes de iniciar el servidor:\n" +
      '  Windows CMD  : set GROQ_API_KEY=gsk_...\n' +
      '  Windows PS   : $env:GROQ_API_KEY="gsk_..."\n' +
      '  Linux/macOS  : export GROQ_API_KEY=gsk_...'
  );
  process.exit(1);
}

// ─── Helpers de validación ───────────────────────────────────
function validarInputs({ nombre_nino, edad, tema, personaje_principal, vocabulario }) {
  const errores = [];

  if (!nombre_nino || typeof nombre_nino !== "string" || !nombre_nino.trim()) {
    errores.push("nombre_nino es obligatorio y debe ser un texto no vacío.");
  }

  const edadNum = Number(edad);
  if (isNaN(edadNum) || edadNum < 5 || edadNum > 9) {
    errores.push("edad debe ser un número entre 5 y 9.");
  }

  if (!tema || typeof tema !== "string" || !tema.trim()) {
    errores.push("tema es obligatorio y debe ser un texto no vacío.");
  }

  if (!personaje_principal || typeof personaje_principal !== "string" || !personaje_principal.trim()) {
    errores.push("personaje_principal es obligatorio y debe ser un texto no vacío.");
  }

  const vocabValidos = ["simple", "medio"];
  if (!vocabulario || !vocabValidos.includes(vocabulario)) {
    errores.push(`vocabulario debe ser uno de: ${vocabValidos.join(", ")}.`);
  }

  return errores;
}

// ─── Construcción del prompt ─────────────────────────────────
function construirPrompt({ nombre_nino, edad, tema, personaje_principal, vocabulario }) {
  const nivelVocab = vocabulario === "simple"
    ? "palabras muy sencillas, oraciones cortas y fáciles de entender"
    : "vocabulario moderado, oraciones un poco más elaboradas pero comprensibles";

  return `Eres un escritor de cuentos infantiles en español. Genera un cuento corto para un niño llamado ${nombre_nino} de ${edad} años.

REQUISITOS:
- Tema: ${tema}
- Personaje principal: ${personaje_principal}
- Nivel de vocabulario: ${nivelVocab}
- El cuento debe ser alegre, educativo y apropiado para la edad.
- Usa el nombre del niño como protagonista o acompañante en la historia.

FORMATO DE RESPUESTA — JSON ESTRICTO (sin texto adicional fuera del JSON):
{
  "titulo": "Título del cuento",
  "frases": ["frase 1", "frase 2", ... ],
  "parrafos": ["párrafo 1", "párrafo 2", ... ]
}

REGLAS DEL JSON:
- "frases" debe tener entre 8 y 12 elementos. Cada frase es una oración individual del cuento.
- "parrafos" debe tener entre 3 y 5 elementos. Cada párrafo agrupa varias frases formando una sección coherente del cuento.
- Las frases y los párrafos deben contar la MISMA historia, solo que segmentada de forma diferente.
- Devuelve ÚNICAMENTE el JSON, sin markdown, sin backticks, sin explicaciones.`;
}

// ─── Llamada a Groq ─────────────────────────────────────────
async function llamarGroq(prompt) {
  const url = "https://api.groq.com/openai/v1/chat/completions";

  const body = {
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: "Eres un asistente que SOLO responde con JSON válido. No añadas texto fuera del JSON."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 2048
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error de la API de Groq (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const contenido = data.choices?.[0]?.message?.content;

  if (!contenido) {
    throw new Error("La respuesta de Groq no contiene contenido válido.");
  }

  return contenido;
}

// ─── Parseo y normalización de la respuesta ──────────────────
function parsearRespuesta(textoRespuesta) {
  // Limpiar posibles backticks de markdown
  let limpio = textoRespuesta.trim();
  if (limpio.startsWith("```")) {
    limpio = limpio.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
  }

  const json = JSON.parse(limpio);

  // Validar estructura
  if (
    typeof json.titulo !== "string" ||
    !Array.isArray(json.frases) ||
    !Array.isArray(json.parrafos)
  ) {
    throw new Error("La respuesta de Groq no tiene la estructura esperada (titulo, frases, parrafos).");
  }

  if (json.frases.length < 8 || json.frases.length > 12) {
    console.warn(`Advertencia: se esperaban 8-12 frases, se recibieron ${json.frases.length}.`);
  }

  if (json.parrafos.length < 3 || json.parrafos.length > 5) {
    console.warn(`Advertencia: se esperaban 3-5 párrafos, se recibieron ${json.parrafos.length}.`);
  }

  return {
    titulo: json.titulo,
    frases: json.frases,
    parrafos: json.parrafos
  };
}

// ─── Endpoint principal ──────────────────────────────────────
app.post("/api/story", async (req, res) => {
  try {
    // 1. Validar inputs
    const errores = validarInputs(req.body);
    if (errores.length > 0) {
      return res.status(400).json({ error: "Datos de entrada inválidos.", detalles: errores });
    }

    // 2. Construir prompt
    const prompt = construirPrompt(req.body);

    // 3. Llamar a Groq
    console.log("Llamando a la API de Groq...");
    const respuestaTexto = await llamarGroq(prompt);
    console.log("Respuesta recibida de Groq.");

    // 4. Parsear y normalizar
    const cuento = parsearRespuesta(respuestaTexto);

    // 5. Devolver JSON normalizado
    return res.json(cuento);
  } catch (error) {
    console.error("Error en /api/story:", error.message);
    return res.status(500).json({
      error: "No se pudo generar el cuento.",
      detalle: error.message
    });
  }
});

// ─── Health check ────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// ─── Iniciar servidor ────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
