const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const GROQ_BASE_URL = "https://api.groq.com/openai/v1";
const GROQ_MODEL = "llama-3.3-70b-versatile";

app.use(cors());
app.use(express.json());

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function splitIntoSentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function chunkSentences(sentences, minParagraphs = 3, maxParagraphs = 5) {
  if (!Array.isArray(sentences) || sentences.length === 0) {
    return [];
  }

  const paragraphCount = Math.min(
    maxParagraphs,
    Math.max(minParagraphs, Math.ceil(sentences.length / 3))
  );
  const perParagraph = Math.ceil(sentences.length / paragraphCount);
  const paragraphs = [];

  for (let i = 0; i < sentences.length; i += perParagraph) {
    paragraphs.push(sentences.slice(i, i + perParagraph).join(" "));
  }

  return paragraphs.slice(0, maxParagraphs);
}

function normalizeStory(raw) {
  const titulo =
    isNonEmptyString(raw?.titulo) ? raw.titulo.trim() : "Cuento sin titulo";

  let frases = Array.isArray(raw?.frases)
    ? raw.frases.filter(isNonEmptyString).map((item) => item.trim())
    : [];

  if (frases.length === 0 && isNonEmptyString(raw?.parrafos?.[0])) {
    frases = splitIntoSentences(raw.parrafos.join(" "));
  }

  if (frases.length < 8) {
    throw new Error("La respuesta de Groq no incluyo suficientes frases.");
  }

  frases = frases.slice(0, 12);

  let parrafos = Array.isArray(raw?.parrafos)
    ? raw.parrafos.filter(isNonEmptyString).map((item) => item.trim())
    : [];

  if (parrafos.length < 3) {
    parrafos = chunkSentences(frases, 3, 5);
  }

  if (parrafos.length < 3) {
    throw new Error("La respuesta de Groq no incluyo suficientes parrafos.");
  }

  parrafos = parrafos.slice(0, 5);

  return { titulo, frases, parrafos };
}

function buildPrompt(input) {
  const { nombre_nino, edad, tema, personaje_principal, vocabulario } = input;

  return `
Eres un escritor infantil experto.
Genera un cuento en espanol para lectura infantil.

Datos:
- nombre_nino: ${nombre_nino}
- edad: ${edad}
- tema: ${tema}
- personaje_principal: ${personaje_principal}
- vocabulario: ${vocabulario}

Reglas estrictas:
1) Devuelve SOLO JSON valido, sin markdown y sin texto adicional.
2) Usa exactamente estas claves: "titulo", "frases", "parrafos".
3) "frases" debe tener entre 8 y 12 frases cortas.
4) "parrafos" debe tener entre 3 y 5 parrafos.
5) Lenguaje apropiado para ninos de ${edad} anos.
`;
}

async function callGroq(input) {
  if (!process.env.GROQ_API_KEY) {
    return {
      ok: false,
      status: 500,
      message:
        "Falta la variable de entorno GROQ_API_KEY en el servidor backend.",
    };
  }

  const response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Devuelve siempre JSON valido y estricto con las claves requeridas.",
        },
        {
          role: "user",
          content: buildPrompt(input),
        },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    return {
      ok: false,
      status: response.status,
      message: `Groq devolvio un error (${response.status}).`,
      details: text.slice(0, 400),
    };
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!isNonEmptyString(content)) {
    return {
      ok: false,
      status: 502,
      message: "Groq no devolvio contenido utilizable.",
    };
  }

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    return {
      ok: false,
      status: 502,
      message: "Groq devolvio contenido que no es JSON valido.",
      details: content.slice(0, 400),
    };
  }

  try {
    const story = normalizeStory(parsed);
    return { ok: true, status: 200, story };
  } catch (error) {
    return {
      ok: false,
      status: 502,
      message: "La respuesta de Groq no cumplio el formato esperado.",
      details: error.message,
    };
  }
}

app.post("/api/story", async (req, res) => {
  const { nombre_nino, edad, tema, personaje_principal, vocabulario } =
    req.body || {};

  if (
    !isNonEmptyString(nombre_nino) ||
    !isNonEmptyString(tema) ||
    !isNonEmptyString(personaje_principal)
  ) {
    return res.status(400).json({
      error:
        "nombre_nino, tema y personaje_principal son obligatorios y no pueden estar vacios.",
    });
  }

  const ageNumber = Number(edad);
  if (!Number.isInteger(ageNumber) || ageNumber < 5 || ageNumber > 9) {
    return res
      .status(400)
      .json({ error: "edad debe ser un entero entre 5 y 9." });
  }

  if (!["simple", "medio"].includes(vocabulario)) {
    return res
      .status(400)
      .json({ error: "vocabulario debe ser 'simple' o 'medio'." });
  }

  try {
    const result = await callGroq({
      nombre_nino: nombre_nino.trim(),
      edad: ageNumber,
      tema: tema.trim(),
      personaje_principal: personaje_principal.trim(),
      vocabulario,
    });

    if (!result.ok) {
      return res.status(result.status).json({
        error: result.message,
        details: result.details || undefined,
      });
    }

    return res.json(result.story);
  } catch (error) {
    return res.status(500).json({
      error: "Error inesperado al generar el cuento.",
      details: error?.message || "Sin detalles",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend escuchando en http://localhost:${PORT}`);
});
