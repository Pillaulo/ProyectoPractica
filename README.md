# Cuentos Mágicos - Lectura Infantil Personalizada

Aplicación web para generar cuentos infantiles personalizados con lectura progresiva, dirigida a niños de 5 a 9 años. Utiliza la API de Groq (LLM) para crear historias únicas basadas en los datos del niño.

## Estructura del proyecto

```
/
├── backend/                        # Node.js + Express
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js         # Infraestructura: conexión SQLite
│   │   ├── controllers/
│   │   │   └── storyController.js  # Presentación: manejo de requests HTTP
│   │   ├── middleware/
│   │   │   └── errorHandler.js     # Middleware de errores centralizado
│   │   ├── providers/
│   │   │   └── groqProvider.js     # Infraestructura: adapter Groq API
│   │   ├── repositories/
│   │   │   └── storyRepository.js  # Infraestructura: acceso a datos (DAL)
│   │   ├── routes/
│   │   │   └── storyRoutes.js      # Definición de rutas
│   │   ├── services/
│   │   │   └── storyService.js     # Lógica de aplicación
│   │   ├── types/
│   │   │   └── story.js            # DTOs y tipos documentados
│   │   ├── validators/
│   │   │   └── storyValidator.js   # Validación con Zod
│   │   └── index.js                # Entry point del servidor
│   ├── .env.example
│   └── package.json
│
├── frontend/                       # React + Vite
│   ├── src/
│   │   ├── components/             # Presentación: componentes UI
│   │   │   ├── ErrorMessage.jsx
│   │   │   ├── StoryForm.jsx
│   │   │   ├── StoryHistory.jsx
│   │   │   └── StoryReader.jsx
│   │   ├── hooks/                  # Lógica de aplicación
│   │   │   ├── useStoryGenerator.js
│   │   │   └── useStoryReader.js
│   │   ├── services/               # Infraestructura HTTP
│   │   │   └── storyApi.js
│   │   ├── styles/
│   │   │   └── global.css
│   │   ├── App.jsx                 # Página principal
│   │   └── main.jsx                # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## Capas de arquitectura

### Backend

| Capa | Carpeta | Responsabilidad |
|------|---------|-----------------|
| Presentación | `controllers/`, `routes/` | Recibir HTTP requests, delegar al servicio, devolver respuestas |
| Lógica de aplicación | `services/` | Orquestar generación de cuentos y persistencia |
| Infraestructura | `providers/`, `repositories/`, `config/` | Acceso a Groq API, acceso a BD, configuración |
| Validación | `validators/` | Validar y sanitizar inputs con Zod |
| Tipos | `types/` | Documentación de DTOs (StoryRequest, StoryResponse) |

### Frontend

| Capa | Carpeta | Responsabilidad |
|------|---------|-----------------|
| Presentación | `components/`, `App.jsx` | Renderizar UI, capturar eventos |
| Lógica de aplicación | `hooks/` | Estado de lectura, generación, modo, índice |
| Infraestructura | `services/` | Llamadas HTTP al backend |

## Requisitos previos

- **Node.js** v18 o superior
- **npm** v9 o superior
- Una **API key de Groq** (obtener en https://console.groq.com)

## Instrucciones para ejecutar localmente

### 1. Configurar el backend

```bash
cd backend
cp .env.example .env
```

Editar el archivo `.env` y colocar tu API key de Groq:

```
GROQ_API_KEY=gsk_tu_api_key_real_aqui
DATABASE_URL=./data/stories.db
PORT=3001
```

Instalar dependencias e iniciar:

```bash
npm install
npm run dev
```

El backend estará en `http://localhost:3001`.

### 2. Configurar el frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

El frontend estará en `http://localhost:5173` y hace proxy automático de `/api` al backend.

## Ejemplos curl

### Generar un cuento

```bash
curl -X POST http://localhost:3001/api/story \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_nino": "Sofía",
    "edad": 7,
    "tema": "aventura en el espacio",
    "personaje_principal": "un dragón amigable",
    "vocabulario": "simple"
  }'
```

Respuesta esperada:

```json
{
  "titulo": "El Dragón que Viajó a las Estrellas",
  "frases": ["Había una vez un dragón...", "..."],
  "parrafos": ["Había una vez un dragón que vivía...", "..."]
}
```

### Listar historial de sesiones

```bash
curl http://localhost:3001/api/sessions
```

Respuesta esperada:

```json
[
  {
    "id": 1,
    "created_at": "2026-02-27 04:30:00",
    "nombre_nino": "Sofía",
    "tema": "aventura en el espacio",
    "titulo": "El Dragón que Viajó a las Estrellas"
  }
]
```

### Obtener detalle de una sesión

```bash
curl http://localhost:3001/api/sessions/1
```

## Manejo de errores

Todos los errores siguen el formato estándar:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "..." } }
```

| Código HTTP | Código error | Causa |
|-------------|-------------|-------|
| 400 | VALIDATION_ERROR | Inputs inválidos (edad fuera de rango, campos vacíos) |
| 404 | NOT_FOUND | Sesión no encontrada |
| 502 | GROQ_ERROR | Error de la API de Groq o respuesta inválida |
| 500 | INTERNAL_ERROR | Error inesperado del servidor |

## Supuestos y limitaciones

1. **Sin autenticación**: no hay usuarios, login ni sesiones de usuario.
2. **Estado de lectura en memoria**: la posición de lectura (paso actual, modo) vive solo en el frontend y se pierde al recargar.
3. **SQLite nativo**: se usa `node:sqlite` (módulo integrado en Node.js v22.5+). El archivo de BD se crea automáticamente en `backend/data/stories.db`. No requiere dependencias externas de SQLite.
4. **Modelo Groq**: se usa `llama-3.3-70b-versatile`. Si el modelo cambia de nombre en Groq, actualizar en `backend/src/providers/groqProvider.js`.
5. **Reintentos**: ante JSON inválido de Groq, se reintenta 1 vez antes de devolver error 502.
6. **Sin assets externos**: todos los estilos son CSS propio, no se depende de CDN ni imágenes externas.
7. **CORS abierto**: configurado con `origin: '*'` para desarrollo local.

## Checklist de cumplimiento

- [x] Monorepo con `/frontend` y `/backend`
- [x] Separación en capas: Presentación, Lógica de aplicación, Infraestructura
- [x] `GROQ_API_KEY` leída exclusivamente desde variable de entorno
- [x] `.env.example` con `GROQ_API_KEY` y `DATABASE_URL`
- [x] Frontend NO contiene API key ni construye prompts
- [x] Formulario con: nombre_nino, edad (5-9), tema, personaje_principal, vocabulario
- [x] Vista de lectura con selector Frases/Párrafos, Anterior/Siguiente, indicador "Paso X de N", Reiniciar
- [x] Historial de cuentos (lista + detalle)
- [x] Diseño infantil con paleta: #FF6B6B, #4D96FF, #FFD93D, #F7F8FC
- [x] Tipografía grande y legible (min 16px, títulos 24-32px)
- [x] Botones grandes con bordes redondeados
- [x] Tarjetas (cards) para secciones
- [x] Accesibilidad: contraste adecuado, estados hover/focus visibles
- [x] `POST /api/story` con validación y respuesta JSON normalizada
- [x] `GET /api/sessions` lista últimas sesiones
- [x] `GET /api/sessions/:id` detalle con frases y párrafos
- [x] Validación con Zod (400 para errores)
- [x] Errores: 400, 404, 502, 500 con formato estándar
- [x] Guardado automático en BD al generar cuento
- [x] Repository / Data Access Layer dedicado
- [x] Provider/Adapter para Groq separado
- [x] Prompt exige salida JSON estricto a Groq
- [x] Reintento 1 vez ante JSON inválido de Groq
- [x] CORS configurado
- [x] Sin funcionalidades extra fuera de lo especificado
- [x] Persistencia solo para historial (sin usuarios, login, autenticación)
