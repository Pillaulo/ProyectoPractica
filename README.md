## Cuentos personalizados con lectura progresiva (M1)

Monorepo con:
- `backend/`: API Node.js + Express + SQLite (historial)
- `frontend/`: React + Vite (UI infantil + lectura progresiva)

### Requisitos
- Node.js 18+ (recomendado 20+)

### 1) Backend (API)
En una terminal:

```bash
cd ".\\backend"
# PowerShell:
Copy-Item .env.example .env
# (alternativa Git Bash): cp .env.example .env
npm install
npm run dev
```

Configura en `backend/.env`:
- `GROQ_API_KEY`: tu API key de Groq (**solo backend**)
- `DATABASE_URL`: ruta SQLite. Ejemplo: `sqlite:./data/story.db`

El backend corre en `http://localhost:3001`.

### 2) Frontend (UI)
En otra terminal:

```bash
cd ".\\frontend"
npm install
npm run dev
```

El frontend corre en `http://localhost:5173` y usa proxy a `/api` hacia el backend.

### Ejemplos cURL

Generar cuento:

```bash
curl -X POST "http://localhost:3001/api/story" ^
  -H "Content-Type: application/json" ^
  -d "{\"nombre_nino\":\"Luna\",\"edad\":7,\"tema\":\"amistad\",\"personaje_principal\":\"un dragón\",\"vocabulario\":\"simple\"}"
```

Listar sesiones:

```bash
curl "http://localhost:3001/api/sessions"
```

Detalle de sesión:

```bash
curl "http://localhost:3001/api/sessions/1"
```

### Supuestos y limitaciones
- Persistencia **solo** para historial de cuentos (tabla `story_sessions`).
- Sin usuarios, login ni autenticación.
- El frontend **no** construye prompts ni llama a Groq.
- Si Groq devuelve JSON inválido, el backend reintenta 1 vez; si falla, responde 502.

### Estructura y capas (responsabilidades)

**Frontend (`frontend/src/`)**
- **Presentación**: `pages/` y `components/` (UI + eventos, sin prompts, sin Groq, sin normalización de IA).
- **Lógica de aplicación**: `state/` (modo Frases/Párrafos, índice, reiniciar).
- **Infraestructura**: `services/` (HTTP hacia `/api`).

**Backend (`backend/src/`)**
- **Routes/Controller**: `routes/`, `controllers/` (HTTP, validación y delegación).
- **Validator**: `validators/` (Zod: trimming, rangos, requeridos).
- **Service**: `services/` (prompt + parse/validación del JSON + reintento 1 vez + persistencia vía repository).
- **Provider/Adapter**: `providers/groq/` (llamada HTTP a Groq usando `GROQ_API_KEY`).
- **Repository (Data Access Layer)**: `repositories/` (SQLite: tabla `story_sessions`).
- **Infraestructura**: `infrastructure/db/` (conexión SQLite a partir de `DATABASE_URL`).

### Formato estándar de error (API)
Siempre:
```json
{ "error": { "code": "VALIDATION_ERROR", "message": "..." } }
```

### Checklist de cumplimiento (alto nivel)
- Frontend React+Vite con capas (`pages/components`, `state`, `services`)
- Backend Express con capas (routes/controller/service/provider/validator/repository)
- `GROQ_API_KEY` **solo** en backend vía variable de entorno
- `DATABASE_URL` para SQLite
- Endpoints: `POST /api/story`, `GET /api/sessions`, `GET /api/sessions/:id`
- Manejo de errores estándar (400/502/500)

