# Backend — Cuentos Personalizados

Backend con arquitectura hexagonal para la generación de cuentos personalizados con lectura progresiva.

## Stack tecnológico

| Tecnología | Versión | Justificación |
|------------|---------|---------------|
| **Node.js** | ≥18 | LTS estable, `crypto.randomUUID` nativo, amplia adopción |
| **TypeScript** | 5.x | Tipado estático, mejor DX y detección temprana de errores |
| **Express** | 4.x | Framework HTTP minimalista, enorme ecosistema y documentación |
| **Groq SDK** | 0.37.x | Cliente oficial para Groq; inferencia rápida (Llama, Mixtral) |
| **Jest** | 29.x | Test runner estándar, integración con TypeScript vía ts-jest |
| **UUID** | 10.x | Generación de IDs únicos sin colisiones |
| **better-sqlite3** | 11.x | SQLite síncrono, cero configuración, ideal para desarrollo |

### Alternativas consideradas

- **Fastify vs Express**: Express elegido por simplicidad y documentación; Fastify podría valorarse en etapas de optimización.
- **SQLite/Postgres**: SQLite para desarrollo y staging; la arquitectura permite migrar a Postgres sin tocar dominio.
- **Vitest vs Jest**: Jest elegido por madurez y compatibilidad con ts-jest.

## Estructura hexagonal

```
src/
├── domain/           # Entidades y value objects (sin dependencias externas)
│   ├── entities/
│   └── value-objects/
├── application/      # Casos de uso y servicios de aplicación
│   ├── use-cases/
│   └── services/
├── ports/            # Interfaces (ProfileRepository, StoryRepository, LLMProvider)
├── adapters/
│   ├── http/         # Express
│   ├── persistence/  # InMemory, SqliteProfileRepository, SqliteStoryRepository
│   └── llm/          # Groq / StubLLM
└── infra/            # Config, container, composición
```

## Caso de uso principal: CreateStory (GenerateStory)

1. Busca el perfil del lector por ID.
2. Llama al LLM con nombre, nivel y temas del perfil.
3. Fragmenta el texto en segmentos para lectura progresiva.
4. Crea la entidad Story con sus fragmentos.
5. Persiste en el repositorio.

**LLM**: Solo se consume desde backend. Usa **Groq API** (Llama 3.1, Mixtral). La API key se carga desde `GROQ_API_KEY`. Si no está definida, se usa `StubLLMProvider` (respuesta mock).

## Persistencia

- **Con base de datos**: Si `DATABASE_PATH` está definido, se usan `SqliteProfileRepository` y `SqliteStoryRepository` con SQLite. El esquema se aplica automáticamente al arrancar.
- **Sin base de datos**: Si `DATABASE_PATH` no está definido, se usa persistencia in-memory (datos se pierden al reiniciar).

El dominio **no depende** de la base de datos; los adaptadores implementan los puertos `ProfileRepository` y `StoryRepository`. Ver `docs/schema.sql` para el esquema.

## Instalación

```bash
cd backend
npm install
```

## Ejecución

```bash
# Desarrollo (con recarga)
npm run dev

# Producción
npm run build
npm start
```

## Variables de entorno

Crear `.env` a partir de `.env.example`:

```
PORT=3000
GROQ_API_KEY=gsk_...       # Opcional: sin ella se usa StubLLM
NODE_ENV=development
DATABASE_PATH=./data/cuentos.db   # SQLite. Sin definir = in-memory
```

| Variable | Descripción |
|----------|-------------|
| `PORT` | Puerto HTTP (default 3000) |
| `GROQ_API_KEY` | API key de Groq (obtener en console.groq.com). Opcional: usa StubLLM si falta |
| `DATABASE_PATH` | Ruta al archivo SQLite. `:memory:` para BD temporal. Si no se define, persistencia in-memory |

## Tests

```bash
npm test
```

- **Unitarios**: `CreateStory` con mocks de repositorios y LLM.
- **Integración**: `SqliteStoryRepository` contra SQLite `:memory:` — persiste y recupera cuentos con segmentos.

## API (resumen)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/v1/profiles` | Crear perfil de lector |
| GET | `/api/v1/profiles` | Listar perfiles |
| POST | `/api/v1/stories` | Generar cuento (body: `profileId`, opc. `maxLength`) |
| GET | `/api/v1/stories/:id` | Obtener cuento |
| GET | `/api/v1/stories/:id/segments` | Obtener segmentos del cuento |
| GET | `/api/v1/profiles/:id/stories` | Historial de cuentos por perfil |

## Flujo de prueba manual

```bash
# 1. Crear perfil
curl -X POST http://localhost:3000/api/v1/profiles \
  -H "Content-Type: application/json" \
  -d '{"name":"Luna","readingLevel":"basico","themes":["animales"]}'

# 2. Generar cuento (usar el id del perfil)
curl -X POST http://localhost:3000/api/v1/stories \
  -H "Content-Type: application/json" \
  -d '{"profileId":"<PROFILE_ID>"}'

# 3. Obtener cuento
curl http://localhost:3000/api/v1/stories/<STORY_ID>

# 4. Obtener segmentos
curl http://localhost:3000/api/v1/stories/<STORY_ID>/segments
```
