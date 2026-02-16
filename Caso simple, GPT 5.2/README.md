# Cuentos personalizados (M0) – Frontend + Backend (Groq)

Aplicación web **sin persistencia** para apoyar lectura infantil con cuentos personalizados y **lectura progresiva** (modo Frases / Párrafos).

## Requisitos

- Node.js **18+** (recomendado 20+).
- Una API key de Groq en una variable de entorno llamada **`GROQ_API_KEY`** (no se usa en el frontend).

## Estructura

- `backend/`: Express (proxy hacia Groq).
- `frontend/`: React + Vite (UI).

## 1) Ejecutar el backend

En una terminal:

```bash
cd backend
npm install
```

### Configurar `GROQ_API_KEY` (EXCLUSIVO desde entorno)

Opción A (Windows PowerShell, sesión actual):

```powershell
$env:GROQ_API_KEY="TU_API_KEY_DE_GROQ"
```

Opción B (archivo `.env` en `backend/`):

1. Copia `backend/.env.example` a `backend/.env`
2. Edita `backend/.env` y define `GROQ_API_KEY=...`

Luego inicia:

```bash
npm run dev
```

El backend quedará en `http://localhost:8787` (o `PORT` si lo cambias).

## 2) Ejecutar el frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite levantará algo como `http://localhost:5173` y hará proxy de `/api` hacia `http://localhost:8787`.

## 3) Probar el endpoint con curl

Con el backend corriendo:

```bash
curl -X POST http://localhost:8787/api/story ^
  -H "Content-Type: application/json" ^
  -d "{\"nombre_nino\":\"Sofía\",\"edad\":7,\"tema\":\"amistad en la escuela\",\"personaje_principal\":\"un zorro curioso\",\"vocabulario\":\"simple\"}"
```

Respuesta esperada (normalizada):

```json
{
  "titulo": "string",
  "frases": ["... 8–12 ..."],
  "parrafos": ["... 3–5 ..."]
}
```

## Supuestos y limitaciones

- **Sin persistencia**: el estado vive solo en memoria del frontend; al recargar, se pierde.
- **Sin sesiones ni autenticación**.
- El backend valida entradas básicas y depende de Groq para el contenido; si Groq devuelve JSON inválido o fuera del contrato, el backend responde con error claro.
- Se usa el modelo `llama-3.3-70b-versatile` vía API OpenAI-compatible de Groq.
- La API key **no** se expone al frontend y **no** está hardcodeada: se lee **solo** desde `GROQ_API_KEY` en el backend.

