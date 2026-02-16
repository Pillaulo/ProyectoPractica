# 📚 Cuentos Personalizados - Aplicación de Lectura Infantil

Aplicación web full-stack para generar cuentos personalizados con lectura progresiva, diseñada para apoyar el aprendizaje de lectura en niños de 5 a 9 años.

## 🎯 Características

- **Generación de cuentos personalizados** usando IA (Groq API)
- **Lectura progresiva** con dos modos:
  - **Frases**: Navegación frase por frase (8-12 frases)
  - **Párrafos**: Navegación párrafo por párrafo (3-5 párrafos)
- **Interfaz amigable** con diseño colorido y animaciones suaves
- **Sin persistencia**: Estado en memoria (M0 - versión básica)

## 🏗️ Arquitectura

```
proyecto/
├── backend/          # Node.js + Express (proxy a Groq API)
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
└── frontend/         # React + Vite
    ├── src/
    │   ├── components/
    │   │   ├── StoryForm.jsx
    │   │   └── StoryReader.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── .gitignore
```

## 📋 Requisitos Previos

- **Node.js** 18+ ([Descargar](https://nodejs.org/))
- **npm** (incluido con Node.js)
- **API Key de Groq** ([Obtener gratis](https://console.groq.com/keys))

## 🚀 Instalación y Configuración

### 1. Configurar el Backend

```powershell
# Navegar a la carpeta backend
cd backend

# Instalar dependencias
npm install

# Crear archivo .env desde el ejemplo
copy .env.example .env

# Editar .env y agregar tu API key de Groq
# GROQ_API_KEY=tu_api_key_aqui
```

**⚠️ IMPORTANTE**: Debes editar el archivo `.env` y reemplazar `your_groq_api_key_here` con tu API key real de Groq.

### 2. Configurar el Frontend

```powershell
# Desde la raíz del proyecto, navegar a frontend
cd ..\frontend

# Instalar dependencias
npm install
```

## ▶️ Ejecución Local

### Iniciar el Backend (Terminal 1)

```powershell
cd backend
npm start
```

Deberías ver:
```
✅ Server running on http://localhost:3000
✅ GROQ_API_KEY is configured
📚 Ready to generate stories!
```

### Iniciar el Frontend (Terminal 2)

```powershell
cd frontend
npm run dev
```

Deberías ver:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

### Acceder a la Aplicación

Abre tu navegador en: **http://localhost:5173**

## 🧪 Prueba con curl

Puedes probar el endpoint del backend directamente:

```powershell
curl -X POST http://localhost:3000/api/story `
  -H "Content-Type: application/json" `
  -d '{
    \"nombre_nino\": \"María\",
    \"edad\": 7,
    \"tema\": \"aventura espacial\",
    \"personaje_principal\": \"astronauta valiente\",
    \"vocabulario\": \"medio\"
  }'
```

**Respuesta esperada:**
```json
{
  "titulo": "María y la Aventura Espacial",
  "frases": [
    "María era una astronauta muy valiente.",
    "Un día decidió viajar al espacio.",
    ...
  ],
  "parrafos": [
    "María era una astronauta muy valiente. Un día decidió viajar al espacio...",
    ...
  ]
}
```

## 📝 Uso de la Aplicación

1. **Llenar el formulario** con:
   - Nombre del niño/a
   - Edad (5-9 años)
   - Tema del cuento
   - Personaje principal
   - Nivel de vocabulario (simple/medio)

2. **Generar cuento** haciendo clic en "Generar Cuento"

3. **Leer progresivamente**:
   - Seleccionar modo: **Frases** o **Párrafos**
   - Navegar con botones **Anterior** / **Siguiente**
   - Ver progreso: "Paso X de N"

4. **Reiniciar** para crear un nuevo cuento

## 🔧 API del Backend

### POST /api/story

**Request Body:**
```json
{
  "nombre_nino": "string (requerido)",
  "edad": "number 5-9 (requerido)",
  "tema": "string (requerido)",
  "personaje_principal": "string (requerido)",
  "vocabulario": "simple|medio (requerido)"
}
```

**Response (200 OK):**
```json
{
  "titulo": "string",
  "frases": ["string", ...],    // 8-12 elementos
  "parrafos": ["string", ...]   // 3-5 elementos
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Validation failed",
  "details": ["error1", "error2"]
}
```

**Response (500 Internal Server Error):**
```json
{
  "error": "Error message",
  "details": "Detailed error description"
}
```

## 🔐 Seguridad

- ✅ La API key de Groq se lee **exclusivamente** desde la variable de entorno `GROQ_API_KEY`
- ✅ **NO** está hardcodeada en el código fuente
- ✅ El archivo `.env` está en `.gitignore` para evitar commits accidentales
- ✅ Se proporciona `.env.example` como plantilla

## 📌 Supuestos y Limitaciones (M0)

### Supuestos
- El usuario tiene Node.js 18+ instalado
- El usuario tiene acceso a internet para llamar a la API de Groq
- El usuario tiene una API key válida de Groq
- El navegador soporta ES6+ (Chrome, Firefox, Edge modernos)

### Limitaciones
- **Sin persistencia**: Los cuentos se pierden al recargar la página
- **Sin base de datos**: No se guardan cuentos generados
- **Sin autenticación**: No hay usuarios ni sesiones
- **Sin historial**: No se puede ver cuentos anteriores
- **Estado en memoria**: Todo vive en el frontend
- **Un cuento a la vez**: No se pueden tener múltiples cuentos abiertos
- **Sin edición**: No se pueden modificar cuentos generados
- **Dependencia de Groq**: Si la API de Groq falla, la app no funciona

### Modelo de IA
- Se usa `llama-3.3-70b-versatile` de Groq
- El modelo puede generar respuestas ligeramente diferentes cada vez
- Ocasionalmente el modelo puede no seguir el formato JSON exacto (se maneja con error handling)

## 🛠️ Tecnologías Utilizadas

**Backend:**
- Node.js
- Express.js
- dotenv (variables de entorno)
- cors (CORS middleware)

**Frontend:**
- React 18
- Vite (build tool)
- CSS moderno (gradientes, animaciones)

**API:**
- Groq API (OpenAI-compatible)
- Modelo: llama-3.3-70b-versatile

## 📂 Estructura del Proyecto

```
Caso simple, Sonnet 4.5/
├── backend/
│   ├── server.js           # Servidor Express con endpoint /api/story
│   ├── package.json        # Dependencias del backend
│   ├── .env.example        # Plantilla de variables de entorno
│   ├── .gitignore          # Ignora node_modules y .env
│   └── .env                # Tu API key (NO commitear)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── StoryForm.jsx      # Formulario de generación
│   │   │   └── StoryReader.jsx    # Lector progresivo
│   │   ├── App.jsx                # Componente principal
│   │   ├── main.jsx               # Entry point
│   │   └── index.css              # Estilos globales
│   ├── index.html                 # HTML base
│   ├── package.json               # Dependencias del frontend
│   ├── vite.config.js             # Configuración de Vite
│   └── .gitignore                 # Ignora node_modules y dist
│
└── README.md                      # Este archivo
```

## 🐛 Troubleshooting

### Error: "GROQ_API_KEY environment variable is not set"
- Asegúrate de haber creado el archivo `.env` en la carpeta `backend`
- Verifica que la API key esté correctamente configurada
- Reinicia el servidor backend después de editar `.env`

### Error: "Failed to fetch" en el frontend
- Verifica que el backend esté corriendo en `http://localhost:3000`
- Verifica que el frontend esté corriendo en `http://localhost:5173`
- Revisa la consola del navegador para más detalles

### Error: "Invalid response from Groq API"
- Verifica que tu API key de Groq sea válida
- Verifica que tengas créditos disponibles en tu cuenta de Groq
- Revisa los logs del backend para ver el error específico

### El cuento no se genera correctamente
- Verifica la respuesta en la consola del navegador
- Revisa los logs del backend
- Intenta con diferentes parámetros en el formulario

## 📄 Licencia

MIT

## 👨‍💻 Desarrollo

Este es un proyecto M0 (versión mínima viable) sin persistencia. Para versiones futuras se podría agregar:
- Base de datos para guardar cuentos
- Autenticación de usuarios
- Historial de cuentos generados
- Favoritos
- Compartir cuentos
- Modo offline
- Más opciones de personalización
