# 📚 CuentoMágico — Guía de ejecución local

Aplicación web full-stack para lectura infantil mediante cuentos personalizados con lectura progresiva.

---

## Estructura del monorepo

```
/
├── backend/                    # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── index.ts            # Entry point (carga .env, arranca servidor)
│   │   ├── app.ts              # Configuración Express + CORS + rutas
│   │   ├── types/
│   │   │   ├── dto.ts          # [TIPOS] StoryRequest, StoryResponse, SessionDetail
│   │   │   └── errors.ts       # [TIPOS] GroqServiceError, GroqParseError
│   │   ├── validators/
│   │   │   └── storyValidator.ts  # [VALIDATOR] Zod schema de la request
│   │   ├── db/
│   │   │   └── database.ts     # [INFRAESTRUCTURA] Conexión SQLite + esquema
│   │   ├── repositories/
│   │   │   └── sessionRepository.ts  # [REPOSITORY] Único acceso a la BD
│   │   ├── providers/
│   │   │   └── groqProvider.ts # [ADAPTER] Comunicación con API Groq
│   │   ├── services/
│   │   │   └── storyService.ts # [SERVICIO] Lógica de aplicación
│   │   ├── controllers/
│   │   │   └── storyController.ts  # [CONTROLLER] Ciclo HTTP
│   │   └── routes/
│   │       └── storyRoutes.ts  # [ROUTES] Definición de endpoints
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # React + Vite + TypeScript
│   ├── src/
│   │   ├── main.tsx            # Entry point
│   │   ├── App.tsx             # Raíz de la aplicación
│   │   ├── index.css           # Estilos globales
│   │   ├── types/
│   │   │   └── story.ts        # [TIPOS] StoryFormData, Story, Session*
│   │   ├── services/           # [INFRAESTRUCTURA HTTP]
│   │   │   └── storyApi.ts     # Llamadas fetch al backend
│   │   ├── state/              # [LÓGICA DE APLICACIÓN]
│   │   │   └── useStory.ts     # Hook: modo, índice, navegación, carga
│   │   ├── components/         # [PRESENTACIÓN]
│   │   │   ├── StoryForm.tsx
│   │   │   ├── StoryReader.tsx
│   │   │   ├── HistoryList.tsx
│   │   │   ├── HistoryDetail.tsx
│   │   │   └── ErrorMessage.tsx
│   │   └── pages/              # [PRESENTACIÓN]
│   │       └── HomePage.tsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── README.md
```

---

## Capas y responsabilidades

### Backend

| Capa | Archivos | Responsabilidad |
|------|----------|----------------|
| **Presentación** | `routes/`, `controllers/` | Manejar HTTP: request → response |
| **Lógica de aplicación** | `services/` | Orquestar provider + repository |
| **Infraestructura** | `providers/`, `db/`, `repositories/` | Groq, SQLite, acceso a datos |
| **Transversal** | `types/`, `validators/` | Contratos y validación |

### Frontend

| Capa | Directorio | Responsabilidad |
|------|-----------|----------------|
| **Presentación** | `components/`, `pages/` | Renderizar UI y emitir eventos |
| **Lógica de aplicación** | `state/` | Modo, índice, navegación en memoria |
| **Infraestructura HTTP** | `services/` | Llamadas `fetch` al backend |

---

## Requisitos previos

- **Node.js** ≥ 18  
- **npm** ≥ 9  
- Una **API Key de Groq** (obtenla gratis en [console.groq.com](https://console.groq.com/))

---

## Instalación y ejecución local

### 1. Clonar / descargar el proyecto

```bash
# Si es un repositorio git:
git clone <url-del-repo>
cd cuentomagico
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

Crea el archivo de variables de entorno:

```bash
# En Windows PowerShell:
Copy-Item .env.example .env
# En macOS/Linux:
cp .env.example .env
```

Edita `backend/.env` y rellena tu API Key:

```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
DATABASE_URL=./data/stories.db
PORT=3001
FRONTEND_URL=http://localhost:5173
```

> **Nota:** El directorio `backend/data/` se crea automáticamente al primer arranque.

### 3. Configurar el Frontend

```bash
cd ../frontend
npm install
```

No necesita archivo `.env`. Usa el proxy de Vite para redirigir `/api/*` al backend.

### 4. Ejecutar en modo desarrollo

Abre **dos terminales** simultáneas:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# → Backend corriendo en http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# → Frontend corriendo en http://localhost:5173
```

Abre el navegador en **http://localhost:5173**

---

## Endpoints de la API

### `POST /api/story`

Genera un cuento y lo guarda en el historial.

**Body:**
```json
{
  "nombre_nino": "Sofía",
  "edad": 7,
  "tema": "una aventura en el bosque mágico",
  "personaje_principal": "un dragón amigable",
  "vocabulario": "simple"
}
```

**Respuesta exitosa (200):**
```json
{
  "titulo": "Sofía y el Dragón del Bosque",
  "frases": [
    "Había una vez una niña llamada Sofía.",
    "..."
  ],
  "parrafos": [
    "Había una vez una niña llamada Sofía que vivía cerca de un bosque mágico...",
    "..."
  ]
}
```

---

### `GET /api/sessions`

Lista las últimas 20 sesiones del historial.

**Respuesta (200):**
```json
[
  {
    "id": 1,
    "created_at": "2024-02-15T10:30:00Z",
    "nombre_nino": "Sofía",
    "tema": "aventura en el bosque",
    "titulo": "Sofía y el Dragón del Bosque"
  }
]
```

---

### `GET /api/sessions/:id`

Detalle completo de una sesión (incluye frases y párrafos).

**Respuesta (200):**
```json
{
  "id": 1,
  "created_at": "2024-02-15T10:30:00Z",
  "nombre_nino": "Sofía",
  "edad": 7,
  "tema": "aventura en el bosque",
  "personaje_principal": "un dragón amigable",
  "vocabulario": "simple",
  "titulo": "Sofía y el Dragón del Bosque",
  "frases": ["...", "..."],
  "parrafos": ["...", "..."]
}
```

---

## Ejemplos curl

### Generar un cuento

```bash
curl -X POST http://localhost:3001/api/story \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_nino": "Mateo",
    "edad": 6,
    "tema": "una nave espacial de colores",
    "personaje_principal": "un robot simpático",
    "vocabulario": "simple"
  }'
```

### Obtener el historial

```bash
curl http://localhost:3001/api/sessions
```

### Obtener una sesión por ID

```bash
curl http://localhost:3001/api/sessions/1
```

### Health check

```bash
curl http://localhost:3001/health
```

---

## Códigos de error

| Código HTTP | `error.code` | Causa |
|-------------|-------------|-------|
| 400 | `VALIDATION_ERROR` | Campos inválidos o fuera de rango |
| 404 | `NOT_FOUND` | Sesión no encontrada |
| 500 | `INTERNAL_ERROR` | Error inesperado del servidor |
| 502 | `GROQ_ERROR` | Error de red o timeout con Groq |
| 502 | `GROQ_PARSE_ERROR` | Respuesta de Groq no es JSON válido |

**Formato estándar de error:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "La edad mínima es 5 años"
  }
}
```

---

## Configuración CORS

El backend permite peticiones **únicamente** desde el origen definido en `FRONTEND_URL`.  
Por defecto: `http://localhost:5173`.

Para producción, cambia la variable:
```env
FRONTEND_URL=https://tu-dominio.com
```

---

## Build para producción

```bash
# Backend
cd backend
npm run build     # Compila TypeScript → dist/
npm start         # Ejecuta dist/index.js

# Frontend
cd frontend
npm run build     # Genera dist/ con activos estáticos
npm run preview   # Previsualiza el build
```

---

## Supuestos y limitaciones

1. **SQLite local:** La base de datos es un archivo local (`data/stories.db`). No apta para entornos multi-instancia. Para producción se recomendaría PostgreSQL.
2. **Sin autenticación:** La persistencia es exclusivamente para historial de cuentos. No hay usuarios ni login.
3. **Estado efímero en frontend:** Al recargar la página, el cuento generado en sesión se pierde. El historial permanente vive en la BD.
4. **Idioma:** Los cuentos se generan siempre en español. El prompt no está parametrizado por idioma.
5. **Modelo Groq:** Se usa `llama-3.3-70b-versatile`. Si Groq deprecara el modelo, cambiar la constante `MODEL` en `groqProvider.ts`.
6. **Retry único:** Ante respuesta inválida o error de red de Groq, se reintenta una sola vez. Si falla dos veces, se devuelve 502.
7. **Historial limitado:** La consulta `findAll` devuelve máximo 20 sesiones recientes.
8. **SQLite puro JavaScript:** Se usa `sql.js` (SQLite compilado a WebAssembly) en lugar de `better-sqlite3`, evitando cualquier compilación nativa (`node-gyp`, Python). Compatible con cualquier plataforma y versión de Node.js ≥ 18.

---

## Checklist de cumplimiento

### Arquitectura y capas

- [x] Separación estricta frontend / backend
- [x] Capa de Presentación: `components/` + `pages/`
- [x] Capa de Lógica de aplicación: `state/useStory.ts` (hook)
- [x] Capa de Infraestructura HTTP: `services/storyApi.ts`
- [x] Capa Controller: `storyController.ts`
- [x] Capa Service: `storyService.ts`
- [x] Capa Provider/Adapter: `groqProvider.ts`
- [x] Capa Validator: `storyValidator.ts` (Zod)
- [x] Capa Types/DTO: `dto.ts` + `story.ts`
- [x] Capa Repository/DAL: `sessionRepository.ts`

### Seguridad

- [x] `GROQ_API_KEY` leída EXCLUSIVAMENTE desde variable de entorno
- [x] El frontend nunca recibe ni conoce la API Key
- [x] `.env.example` incluido; `.env` en `.gitignore`

### Backend

- [x] `POST /api/story` con validación de inputs
- [x] `GET /api/sessions` — lista historial
- [x] `GET /api/sessions/:id` — detalle de sesión
- [x] JSON normalizado `{ titulo, frases, parrafos }`
- [x] Guardado automático en BD tras generar
- [x] Prompt exige salida JSON estricto
- [x] Reintento único ante error de Groq
- [x] Errores 400 / 502 / 500 con formato estándar
- [x] CORS configurado por variable de entorno

### Frontend

- [x] Formulario con todos los campos especificados
- [x] Selector modo Frases / Párrafos
- [x] Botones Anterior / Siguiente
- [x] Indicador "Paso X de N"
- [x] Botón Reiniciar
- [x] Historial de cuentos con título + fecha
- [x] Abrir sesión del historial en modo lector
- [x] Mensajes de error claros si el backend responde con error
- [x] Estado de carga visible

### Diseño UI

- [x] Paleta de colores infantil (#FF6B6B / #4D96FF / #FFD93D / #F7F8FC)
- [x] Tipografía ≥ 16px; títulos 24–32px
- [x] Botones grandes con bordes redondeados
- [x] Cards para secciones
- [x] Emojis como íconos moderados
- [x] Contraste adecuado
- [x] Estados hover/focus visibles
- [x] Sin assets externos

### Base de datos

- [x] SQLite con tabla `story_sessions`
- [x] Todos los campos requeridos
- [x] Persistencia SOLO para historial
- [x] Sin autenticación / usuarios / login
- [x] `DATABASE_URL` como variable de entorno

### Entregables

- [x] Monorepo `/frontend` + `/backend`
- [x] Código completo
- [x] `.env.example` en backend
- [x] Instrucciones paso a paso
- [x] Configuración CORS
- [x] Ejemplos curl
- [x] Supuestos y limitaciones
- [x] Checklist de cumplimiento
