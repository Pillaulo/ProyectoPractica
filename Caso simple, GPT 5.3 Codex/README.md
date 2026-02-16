# Cuentos Infantiles Personalizados (M0)

Aplicacion web full-stack para generar cuentos infantiles personalizados y leerlos de forma progresiva por frases o parrafos.

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- IA: API de Groq (OpenAI-compatible)

## Estructura del proyecto

```text
.
├─ backend/
│  ├─ .env.example
│  ├─ .gitignore
│  ├─ package.json
│  └─ server.js
└─ frontend/
   ├─ package.json
   └─ src/
      ├─ App.jsx
      ├─ App.css
      ├─ index.css
      └─ main.jsx
```

## Requisitos previos

- Node.js 18+ (recomendado 20+)
- Una API key de Groq valida

## Configuracion de entorno

La API key **NO** esta hardcodeada y se lee solo desde `GROQ_API_KEY`.

### Opcion recomendada (archivo .env en backend)

1. Copia `backend/.env.example` a `backend/.env`.
2. Edita `backend/.env` y coloca:

```env
GROQ_API_KEY=tu_api_key_real_de_groq
PORT=3001
```

### Opcion alternativa (variable de entorno en PowerShell)

```powershell
$env:GROQ_API_KEY="tu_api_key_real_de_groq"
```

## Como ejecutar localmente

### 1) Backend

```powershell
cd "backend"
npm install
npm run dev
```

El backend queda en: `http://localhost:3001`

### 2) Frontend (en otra terminal)

```powershell
cd "frontend"
npm install
npm run dev
```

Vite mostrara la URL local (usualmente `http://localhost:5173`).

El frontend llama por defecto a `http://localhost:3001/api/story`.

## Endpoint backend

### `POST /api/story`

Entrada esperada:

```json
{
  "nombre_nino": "Mateo",
  "edad": 7,
  "tema": "amistad en el bosque",
  "personaje_principal": "una tortuga valiente",
  "vocabulario": "simple"
}
```

Respuesta normalizada:

```json
{
  "titulo": "string",
  "frases": ["..."],
  "parrafos": ["..."]
}
```

- `frases`: entre 8 y 12 elementos
- `parrafos`: entre 3 y 5 elementos

## Ejemplo con curl

```bash
curl -X POST "http://localhost:3001/api/story" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_nino":"Sofia",
    "edad":8,
    "tema":"aventura espacial",
    "personaje_principal":"una astronauta curiosa",
    "vocabulario":"medio"
  }'
```

## Comportamiento funcional (M0)

- Formulario con:
  - `nombre_nino`
  - `edad` (5-9)
  - `tema`
  - `personaje_principal`
  - `vocabulario` (`simple` | `medio`)
- Boton `Generar cuento`
- Vista de lectura:
  - Selector de modo `Frases / Parrafos`
  - Botones `Anterior / Siguiente`
  - Indicador `Paso X de N`
  - Boton `Reiniciar`
- Estado en memoria del frontend (si recargas, se pierde)

## Supuestos y limitaciones

1. No hay base de datos, sesiones ni autenticacion (segun M0).
2. Si Groq devuelve un formato invalido, el backend responde con error claro.
3. La calidad narrativa depende del modelo y de la disponibilidad de Groq.
4. El frontend asume backend en `http://localhost:3001`.
5. No hay persistencia: cada generacion vive solo en el estado actual del navegador.
