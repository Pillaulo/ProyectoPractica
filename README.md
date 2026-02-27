# Lectura Infantil - Monorepo M1

Aplicacion full-stack para generar cuentos infantiles personalizados y leerlos de forma progresiva (frases/parrafos), con historial persistido en SQLite.

## Estructura del monorepo

```text
/
  frontend/   # React + Vite
  backend/    # Node.js + Express + SQLite + Groq
```

## Capas y responsabilidades

### Frontend

- `frontend/src/components` + `frontend/src/pages` -> **Presentacion** (UI y eventos)
- `frontend/src/state` -> **Logica de aplicacion** (modo de lectura, indice, reinicio)
- `frontend/src/services` -> **Infraestructura** HTTP (cliente API y llamadas)

### Backend

- `backend/src/routes` + `backend/src/controllers` -> **Presentacion/API**
- `backend/src/services` -> **Logica de aplicacion**
- `backend/src/providers` -> **Adapter Groq**
- `backend/src/validators` -> **Validacion**
- `backend/src/types` -> **DTO/contrato**
- `backend/src/repositories` -> **Data access layer (SQLite)**
- `backend/src/infrastructure/db` -> **Infraestructura de BD**

## Variables de entorno

En `backend/.env` (crear copiando `backend/.env.example`):

```env
PORT=3000
FRONTEND_ORIGIN=http://localhost:5173,http://localhost:5174
GROQ_API_KEY=tu_api_key_de_groq
DATABASE_URL=file:./data/story_sessions.db
```

Reglas cumplidas:

- La API key **no** esta hardcodeada.
- Se usa **solo** `GROQ_API_KEY` en backend.
- El frontend nunca recibe ni conoce la key.

## Ejecucion local paso a paso

1. Instalar dependencias:
   - `cd backend && npm install`
   - `cd ../frontend && npm install`
2. Configurar backend:
   - Copiar `backend/.env.example` a `backend/.env`
   - Colocar valor real de `GROQ_API_KEY`
3. Levantar backend:
   - `cd backend`
   - `npm run dev`
4. Levantar frontend:
   - `cd frontend`
   - `npm run dev`
5. Abrir navegador en:
   - `http://localhost:5173` o el puerto que reporte Vite (ej. `5174`)

## Endpoints

- `POST /api/story`
- `GET /api/sessions`
- `GET /api/sessions/:id`

## CORS

Configurado en backend con `FRONTEND_ORIGIN` (lista separada por comas).

## Ejemplos curl

### Generar cuento

```bash
curl -X POST http://localhost:3000/api/story \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_nino":"Luna",
    "edad":7,
    "tema":"amistad en el bosque",
    "personaje_principal":"zorro curioso",
    "vocabulario":"simple"
  }'
```

### Listar historial

```bash
curl http://localhost:3000/api/sessions
```

### Obtener sesion por id

```bash
curl http://localhost:3000/api/sessions/1
```

## Manejo de errores

Formato estandar:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "..." } }
```

Codigos:

- `400` -> validacion
- `502` -> fallo Groq/red o respuesta no parseable en 2 intentos
- `500` -> error inesperado

## Supuestos y limitaciones

- No hay autenticacion, usuarios ni login (por requisito).
- Persistencia limitada a historial de cuentos en `story_sessions`.
- Se guarda contenido final del cuento (titulo, frases, parrafos), no prompts completos.
- El frontend mantiene estado de lectura en memoria; al recargar se pierde.
- Si Groq devuelve JSON invalido dos veces, se responde `502`.

## Checklist de cumplimiento

- [x] Monorepo con `/frontend` y `/backend`
- [x] Separacion estricta frontend/backend
- [x] Capas frontend: presentacion + estado + servicios HTTP
- [x] Capas backend: routes/controller, service, provider, validator, DTO, repository
- [x] `GROQ_API_KEY` solo en variable de entorno backend
- [x] Endpoint `POST /api/story` con validacion y salida normalizada
- [x] Historial persistido automaticamente en BD
- [x] Endpoints `GET /api/sessions` y `GET /api/sessions/:id`
- [x] DB configurada por `DATABASE_URL`
- [x] UI infantil con paleta solicitada y accesibilidad basica
- [x] Mensajes de error claros en frontend
