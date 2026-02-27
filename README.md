# Cuentos mágicos - Lectura infantil progresiva

Aplicación web para apoyar la lectura infantil mediante cuentos personalizados generados con IA (Groq), con lectura progresiva por frases o párrafos.

## Estructura del proyecto

```
├── frontend/          # React + Vite
│   ├── src/
│   │   ├── components/   # Presentación (UI)
│   │   ├── pages/       # Páginas
│   │   ├── state/       # Lógica de aplicación (hooks)
│   │   └── services/    # Infraestructura HTTP
│   └── package.json
├── backend/            # Node.js + Express
│   ├── src/
│   │   ├── routes/      # Rutas
│   │   ├── controllers/ # Controllers
│   │   ├── services/    # Lógica de negocio
│   │   ├── providers/   # Adapter Groq
│   │   ├── validators/  # Validación (Zod)
│   │   ├── types/       # DTOs
│   │   ├── repositories/ # Acceso a datos
│   │   └── infrastructure/ # BD, init
│   └── package.json
└── README.md
```

## Requisitos previos

- Node.js 18+
- Cuenta en [Groq](https://console.groq.com/) para obtener una API key

## Pasos para ejecutar localmente

### 1. Configurar el backend

```bash
cd backend
npm install
```

Crear archivo `.env` a partir del ejemplo:

```bash
# Windows
copy .env.example .env

# Linux / macOS
cp .env.example .env
```

Editar `.env` y colocar tu API key de Groq:

```
GROQ_API_KEY=gsk_tu_clave_aqui
DATABASE_URL=./data/stories.db
```

### 2. Iniciar el backend

```bash
npm run dev
```

El backend estará disponible en `http://localhost:3000`.

### 3. Configurar e iniciar el frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:5173`.

### 4. Probar la aplicación

Abrir el navegador en `http://localhost:5173` y completar el formulario para generar un cuento.

---

## Ejemplos curl

### Generar cuento (POST /api/story)

**Bash / curl:**
```bash
curl -X POST http://localhost:3000/api/story \
  -H "Content-Type: application/json" \
  -d "{\"nombre_nino\":\"Luna\",\"edad\":6,\"tema\":\"el bosque mágico\",\"personaje_principal\":\"un zorro curioso\",\"vocabulario\":\"simple\"}"
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/story" -Method Post -ContentType "application/json" -Body '{"nombre_nino":"Luna","edad":6,"tema":"el bosque mágico","personaje_principal":"un zorro curioso","vocabulario":"simple"}'
```

Respuesta esperada:

```json
{
  "titulo": "El zorro curioso en el bosque mágico",
  "frases": ["Había una vez un zorro llamado Luna.", "..."],
  "parrafos": ["Había una vez un zorro llamado Luna. Vivía en un bosque muy especial...", "..."]
}
```

### Listar sesiones (GET /api/sessions)

```bash
curl http://localhost:3000/api/sessions
# PowerShell: Invoke-RestMethod http://localhost:3000/api/sessions
```

Respuesta esperada:

```json
[
  {
    "id": 1,
    "fecha": "2025-02-26 12:00:00",
    "nombre_nino": "Luna",
    "tema": "el bosque mágico",
    "titulo": "El zorro curioso en el bosque mágico"
  }
]
```

### Detalle de sesión (GET /api/sessions/:id)

```bash
curl http://localhost:3000/api/sessions/1
```

---

## Configuración CORS

El backend usa `cors({ origin: true })`, permitiendo peticiones desde cualquier origen durante desarrollo. En producción se recomienda restringir el origen.

---

## Supuestos y limitaciones

| Supuesto / limitación | Descripción |
|----------------------|-------------|
| Sin autenticación | No hay usuarios ni login. El historial es global. |
| Estado en memoria (frontend) | Al recargar la página se pierde el cuento actual; el historial persiste en BD. |
| Modelo Groq | Se usa `llama-3.3-70b-versatile`. Si cambia, actualizar `backend/src/providers/GroqProvider.ts`. |
| SQLite local (sql.js) | Por defecto la BD se crea en `backend/data/stories.db`. Usa sql.js (sin compilación nativa) para compatibilidad multiplataforma. |
| Idioma | El prompt está en español para cuentos en español. |
| Reintentos | Si Groq devuelve JSON inválido, se reintenta 1 vez antes de devolver 502. |

---

## Checklist de cumplimiento

- [x] Separación frontend/backend
- [x] Capas: Presentación, Lógica, Infraestructura (en ambos)
- [x] GROQ_API_KEY solo en backend, desde variable de entorno
- [x] Frontend sin accesso a la API key
- [x] Validación de inputs (edad 5–9, strings no vacíos)
- [x] Respuesta normalizada JSON: titulo, frases, parrafos
- [x] Persistencia SQLite para historial
- [x] GET /api/sessions y GET /api/sessions/:id
- [x] Vista de lectura: modo Frases/Párrafos, Anterior/Siguiente, Paso X de N, Reiniciar
- [x] Historial en frontend con título y fecha
- [x] Paleta: #FF6B6B, #4D96FF, #FFD93D, #F7F8FC
- [x] Tipografía grande, botones redondeados, cards
- [x] Repository para acceso a datos
- [x] .env.example con GROQ_API_KEY y DATABASE_URL
- [x] CORS configurado
