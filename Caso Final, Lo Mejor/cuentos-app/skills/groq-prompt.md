# Skill: Prompt y JSON para Groq

## Esquema JSON esperado del cuento

```json
{
  "version": 1,
  "title": "string",
  "language": "es",
  "spanish_variant": "NEUTRAL|LATAM|ES",
  "reading_level": "PRE_READER|BEGINNER|BASIC|INTERMEDIATE",
  "target_age": 7,
  "story_length": "TINY|SHORT|MEDIUM",
  "estimated_minutes": 4,
  "keywords": ["string"],
  "theme": "string",
  "story": [
    {
      "id": "p1",
      "type": "paragraph",
      "text": "string",
      "phrases": [
        {
          "text": "string",
          "syllables": [
            { "original": "palabra", "segmented": "pa-la-bra" }
          ]
        }
      ]
    }
  ],
  "moral": "string",
  "comprehension_questions": [
    {
      "q": "string",
      "options": ["string", "string", "string"],
      "answer_index": 0
    }
  ],
  "safety": {
    "avoided_topics_respected": true,
    "notes": "string"
  }
}
```

## Instrucciones clave para el modelo

- Usa vocabulario sencillo y frases cortas, adaptadas a la edad y `reading_level`.
- Evita contenido inapropiado (violencia explícita, sexualidad, drogas, autolesiones, odio).
- Respeta siempre la lista de `avoid_topics` del perfil del niño.
- Para `segment_mode`:
  - `PHRASES`: segmenta el párrafo en 1–2 frases por entrada de `phrases`.
  - `SYLLABLES_ES`: rellena `syllables` silabeando en español con guiones (`a-mi-go`).
  - `BOTH`: aplica ambos criterios.
  - `NONE`: puedes dejar `phrases` vacío o con una única frase igual que `text`.
- Devuelve **solo JSON válido**, sin texto fuera del bloque JSON.

Puedes reutilizar este esquema al construir el prompt en el backend.

