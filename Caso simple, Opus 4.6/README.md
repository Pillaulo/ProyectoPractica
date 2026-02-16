# Cuentos Mágicos — Lectura Infantil Personalizada (M0)

Aplicación web que genera cuentos infantiles personalizados mediante IA (Groq) y los presenta con lectura progresiva (por frases o párrafos).

## Estructura del proyecto

```
├── backend/
│   ├── package.json
│   └── server.js          # Express + proxy a Groq
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── StoryForm.jsx / .css    # Formulario de entrada
│   │   │   └── StoryReader.jsx / .css  # Vista de lectura progresiva
│   │   ├── App.jsx / .css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Requisitos previos

- **Node.js** >= 18 (incluye `fetch` nativo)
- **npm** >= 9
- Una **API Key de Groq** válida (obtener en https://console.groq.com)

## Instrucciones paso a paso

### 1. Clonar / descargar el proyecto

Asegúrate de tener la carpeta del proyecto en tu máquina.

### 2. Definir la variable de entorno GROQ_API_KEY

**Windows (PowerShell):**
```powershell
$env:GROQ_API_KEY="gsk_TU_CLAVE_AQUI"
```

**Windows (CMD):**
```cmd
set GROQ_API_KEY=gsk_TU_CLAVE_AQUI
```

**Linux / macOS:**
```bash
export GROQ_API_KEY=gsk_TU_CLAVE_AQUI
```

> La API key solo se usa en el backend. Nunca se expone al navegador.

### 3. Instalar dependencias e iniciar el backend

```bash
cd backend
npm install
npm start
```

El backend correrá en **http://localhost:3001**.

### 4. Instalar dependencias e iniciar el frontend (en otra terminal)

```bash
cd frontend
npm install
npm run dev
```

El frontend correrá en **http://localhost:5173** y redirigirá las llamadas `/api/*` al backend.

### 5. Usar la aplicación

Abre **http://localhost:5173** en tu navegador y completa el formulario.

## Ejemplo de request con curl

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

**Respuesta esperada:**
```json
{
  "titulo": "Sofía y el Dragón del Espacio",
  "frases": [
    "Sofía miró al cielo y vio una estrella muy brillante.",
    "...(8-12 frases)..."
  ],
  "parrafos": [
    "Sofía miró al cielo y vio una estrella muy brillante. Decidió ir a investigar...",
    "...(3-5 párrafos)..."
  ]
}
```

## Supuestos y limitaciones

1. **Sin persistencia**: el estado vive solo en memoria del frontend; al recargar se pierde.
2. **Sin autenticación ni sesiones**: cualquiera con acceso a la URL puede generar cuentos.
3. **Sin base de datos**: no se almacenan cuentos ni datos de usuario.
4. **Modelo de Groq**: se usa `llama-3.3-70b-versatile`. Si el modelo deja de estar disponible, cambiar la variable `model` en `server.js`.
5. **Dependencia de red**: se requiere conexión a Internet para llamar a la API de Groq.
6. **Cantidad de frases/párrafos**: el prompt solicita 8–12 frases y 3–5 párrafos, pero la IA puede desviarse ligeramente; se registra un warning en consola si ocurre.
7. **Idioma**: los cuentos se generan en español.
8. **Navegadores soportados**: cualquier navegador moderno (Chrome, Firefox, Edge, Safari).
9. **Node.js >= 18**: se usa `fetch` nativo (no se instala `node-fetch`).
10. **Puerto backend (3001) y frontend (5173)**: deben estar libres.
