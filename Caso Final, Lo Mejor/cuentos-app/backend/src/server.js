import "dotenv/config";
import express from "express";
import cors from "cors";
import Groq from "groq-sdk";
import { z } from "zod";

const app = express();
const port = Number(process.env.PORT || 4000);
const allowedOrigin = process.env.ALLOWED_ORIGIN || "http://localhost:3000";

app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json({ limit: "1mb" }));

const payloadSchema = z.object({
  age: z.number().int().min(4).max(14),
  readingLevel: z.enum(["PRE_READER", "BEGINNER", "BASIC", "INTERMEDIATE"]),
  theme: z.string().min(2),
  tone: z.enum(["FUNNY", "ADVENTURE", "CALM", "MYSTERY_SOFT", "FRIENDSHIP"]),
  length: z.enum(["TINY", "SHORT", "MEDIUM"]),
  segmentMode: z.enum(["NONE", "SYLLABLES_ES", "PHRASES", "BOTH"]),
  interests: z.array(z.string()).default([]),
  avoidTopics: z.array(z.string()).default([]),
  characters: z.array(z.string()).default([]),
  spanishVariant: z.enum(["NEUTRAL", "LATAM", "ES"]),
});

const storySchema = z.object({
  version: z.number().default(1),
  title: z.string(),
  language: z.string().default("es"),
  spanish_variant: z.enum(["NEUTRAL", "LATAM", "ES"]).default("LATAM"),
  reading_level: z.enum(["PRE_READER", "BEGINNER", "BASIC", "INTERMEDIATE"]),
  target_age: z.number(),
  story_length: z.enum(["TINY", "SHORT", "MEDIUM"]),
  estimated_minutes: z.number(),
  keywords: z.array(z.string()).default([]),
  theme: z.string(),
  story: z.array(
    z.object({
      id: z.string(),
      type: z.literal("paragraph"),
      text: z.string(),
      phrases: z.array(
        z.object({
          text: z.string(),
          syllables: z.array(
            z.object({
              original: z.string(),
              segmented: z.string(),
            }),
          ),
        }),
      ),
    }),
  ),
  moral: z.string(),
  comprehension_questions: z.array(
    z.object({
      q: z.string(),
      options: z.array(z.string()).length(3),
      answer_index: z.number().int().min(0).max(2),
    }),
  ),
  safety: z.object({
    avoided_topics_respected: z.boolean(),
    notes: z.string(),
  }),
});

function parseJsonFromModelOutput(text) {
  const trimmed = (text || "").trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (fenced?.[1]) return JSON.parse(fenced[1].trim());
    const first = trimmed.indexOf("{");
    const last = trimmed.lastIndexOf("}");
    if (first !== -1 && last !== -1 && last > first) {
      return JSON.parse(trimmed.slice(first, last + 1));
    }
    throw new Error("No se pudo parsear JSON");
  }
}

function toParagraphArray(value) {
  if (Array.isArray(value)) {
    return value.map((item, idx) => {
      if (typeof item === "string") {
        return {
          id: `p${idx + 1}`,
          type: "paragraph",
          text: item,
          phrases: [{ text: item, syllables: [] }],
        };
      }
      const phrasesRaw = item.phrases || item.frases || [];
      const phrases = Array.isArray(phrasesRaw)
        ? phrasesRaw.map((f) => ({
            text: String(f.text || f.frase || ""),
            syllables: Array.isArray(f.syllables || f.silabas)
              ? (f.syllables || f.silabas).map((s) => ({
                  original: String(s.original || s.palabra || ""),
                  segmented: String(s.segmented || s.separado || ""),
                }))
              : [],
          }))
        : [];
      return {
        id: String(item.id || `p${idx + 1}`),
        type: "paragraph",
        text: String(item.text || item.parrafo || ""),
        phrases,
      };
    });
  }

  if (typeof value === "string") {
    return value
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((text, idx) => ({
        id: `p${idx + 1}`,
        type: "paragraph",
        text,
        phrases: [{ text, syllables: [] }],
      }));
  }

  return [];
}

function normalizeStoryShape(candidate, input) {
  const root =
    candidate?.data ||
    candidate?.result ||
    candidate?.story_json ||
    candidate?.cuento ||
    candidate;

  return {
    version: Number(root?.version ?? 1),
    title: String(root?.title ?? root?.titulo ?? `Aventura sobre ${input.theme}`),
    language: String(root?.language ?? root?.idioma ?? "es"),
    spanish_variant: root?.spanish_variant ?? root?.variante ?? input.spanishVariant,
    reading_level: root?.reading_level ?? root?.nivel_lectura ?? input.readingLevel,
    target_age: Number(root?.target_age ?? root?.edad_objetivo ?? input.age),
    story_length: root?.story_length ?? root?.longitud ?? input.length,
    estimated_minutes: Number(root?.estimated_minutes ?? root?.minutos_estimados ?? 4),
    keywords: Array.isArray(root?.keywords) ? root.keywords : [input.theme],
    theme: String(root?.theme ?? root?.tema ?? input.theme),
    story: toParagraphArray(root?.story ?? root?.parrafos ?? root?.cuento_texto),
    moral: String(root?.moral ?? root?.moraleja ?? "Con práctica se aprende mejor."),
    comprehension_questions: Array.isArray(root?.comprehension_questions)
      ? root.comprehension_questions
      : Array.isArray(root?.preguntas)
      ? root.preguntas.map((q) => ({
          q: String(q.q || q.pregunta || ""),
          options: Array.isArray(q.options || q.opciones)
            ? (q.options || q.opciones).map((o) => String(o)).slice(0, 3)
            : ["", "", ""],
          answer_index: Number(q.answer_index ?? q.respuesta_indice ?? 0),
        }))
      : [],
    safety: {
      avoided_topics_respected: Boolean(
        root?.safety?.avoided_topics_respected ?? root?.seguridad?.temas_evitados_ok ?? true,
      ),
      notes: String(root?.safety?.notes ?? root?.seguridad?.notas ?? "Validado"),
    },
  };
}

function ensureNonEmptyStory(data, input) {
  if (Array.isArray(data.story) && data.story.length > 0) {
    return data;
  }

  const fallbackParagraphs = [
    `En un barrio tranquilo, un grupo de amigos descubrió que la ${input.theme} crece cuando se ayudan entre todos.`,
    `Cada día practicaron juntos, escuchando con respeto y celebrando los logros de los demás.`,
    `Al final entendieron que compartir, cuidar y conversar con cariño hace que la amistad sea más fuerte.`,
  ];

  return {
    ...data,
    story: fallbackParagraphs.map((text, idx) => ({
      id: `p${idx + 1}`,
      type: "paragraph",
      text,
      phrases: [{ text, syllables: [] }],
    })),
    comprehension_questions:
      data.comprehension_questions && data.comprehension_questions.length > 0
        ? data.comprehension_questions
        : [
            {
              q: "¿Qué aprendieron los personajes?",
              options: [
                "Que la amistad se fortalece ayudando",
                "Que no hay que compartir",
                "Que es mejor competir siempre",
              ],
              answer_index: 0,
            },
          ],
  };
}

function buildMockStory(input) {
  const total = input.length === "TINY" ? 3 : input.length === "SHORT" ? 5 : 7;
  const story = Array.from({ length: total }).map((_, i) => ({
    id: `p${i + 1}`,
    type: "paragraph",
    text: `Hoy aprendimos sobre ${input.theme}. Parte ${i + 1} de la historia.`,
    phrases: [
      {
        text: `Hoy aprendimos sobre ${input.theme}.`,
        syllables: [{ original: "aprendimos", segmented: "a-pren-di-mos" }],
      },
    ],
  }));

  return {
    version: 1,
    title: `Aventura sobre ${input.theme}`,
    language: "es",
    spanish_variant: input.spanishVariant,
    reading_level: input.readingLevel,
    target_age: input.age,
    story_length: input.length,
    estimated_minutes: input.length === "TINY" ? 2 : input.length === "SHORT" ? 4 : 7,
    keywords: [input.theme],
    theme: input.theme,
    story,
    moral: "Con práctica se aprende mejor.",
    comprehension_questions: [
      {
        q: "¿Sobre qué trata el cuento?",
        options: [input.theme, "Cocina", "Números"],
        answer_index: 0,
      },
    ],
    safety: {
      avoided_topics_respected: true,
      notes: "Fallback local",
    },
  };
}

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "backend", at: new Date().toISOString() });
});

app.post("/api/v1/stories/generate-content", async (req, res) => {
  const parsedPayload = payloadSchema.safeParse(req.body);
  if (!parsedPayload.success) {
    return res.status(400).json({ message: "Payload inválido" });
  }

  const input = parsedPayload.data;
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    return res.status(500).json({
      message: "GROQ_API_KEY no configurada en backend/.env",
      code: "GROQ_KEY_MISSING",
    });
  }

  try {
    const groq = new Groq({ apiKey: key });
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.6,
      messages: [
        {
          role: "system",
          content:
            "Genera cuentos infantiles seguros en español y devuelve SOLO JSON válido.",
        },
        {
          role: "user",
          content: `Edad: ${input.age}
Nivel: ${input.readingLevel}
Tema: ${input.theme}
Tono: ${input.tone}
Longitud: ${input.length}
Segmentación: ${input.segmentMode}
Intereses: ${input.interests.join(", ")}
Temas a evitar: ${input.avoidTopics.join(", ")}
Personajes: ${input.characters.join(", ")}
Variante español: ${input.spanishVariant}`,
        },
      ],
    });

    let json;
    try {
      json = parseJsonFromModelOutput(completion.choices[0]?.message?.content ?? "");
    } catch {
      const repaired = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0,
        messages: [
          { role: "system", content: "Devuelve JSON válido sin markdown ni texto extra." },
          { role: "user", content: completion.choices[0]?.message?.content ?? "" },
        ],
      });
      json = parseJsonFromModelOutput(repaired.choices[0]?.message?.content ?? "");
    }

    let data;
    try {
      data = storySchema.parse(normalizeStoryShape(json, input));
    } catch (schemaError) {
      const repairToSchema = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0,
        messages: [
          {
            role: "system",
            content:
              "Convierte el siguiente contenido al esquema JSON exacto solicitado. Responde SOLO JSON válido, sin markdown.",
          },
          {
            role: "user",
            content: JSON.stringify(json),
          },
        ],
      });

      const repairedJson = parseJsonFromModelOutput(
        repairToSchema.choices[0]?.message?.content ?? "{}",
      );
      data = storySchema.parse(normalizeStoryShape(repairedJson, input));
      if (!data) throw schemaError;
    }

    const safeData = ensureNonEmptyStory(data, input);
    return res.json({
      data: safeData,
      model: "llama-3.3-70b-versatile",
      warning: null,
    });
  } catch (error) {
    console.error("Error en Groq backend:", error);
    return res.status(502).json({
      message: "No se pudo generar con Groq desde backend",
      code: "GROQ_BACKEND_ERROR",
    });
  }
});

app.listen(port, () => {
  console.log(`Backend listo en http://localhost:${port}`);
});

