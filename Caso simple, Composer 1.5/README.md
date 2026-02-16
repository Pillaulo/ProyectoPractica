# Cuentos Infantiles – Lectura progresiva (M0)

Aplicación web para apoyar la lectura infantil mediante cuentos personalizados con lectura progresiva. Sin persistencia, usando la API de Groq.

---

## Estructura del proyecto

```
Cursor/
├── backend/
│   ├── server.js          # Servidor Express + proxy Groq
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── Formulario.jsx
│   │   ├── VistaLectura.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## Requisitos previos

- Node.js 18+ (o 20+ recomendado)
- Cuenta en [Groq](https://console.groq.com/) para obtener una API key

---

## Instrucciones paso a paso

### 1. Configurar la variable de entorno GROQ_API_KEY

La API key **no debe estar hardcodeada**. Debe leerse exclusivamente de la variable de entorno `GROQ_API_KEY`.

**Windows (PowerShell):**
```powershell
$env:GROQ_API_KEY = "gsk_tu_api_key_aqui"
```

**Windows (CMD):**
```cmd
set GROQ_API_KEY=gsk_tu_api_key_aqui
```

**Linux / macOS:**
```bash
export GROQ_API_KEY=gsk_tu_api_key_aqui
```

**Opción con archivo .env (recomendado para desarrollo):**
```bash
# En la carpeta backend/
cp .env.example .env
# Edita .env y añade tu API key
```

---

### 2. Instalar dependencias y arrancar el backend

```bash
cd backend
npm install
# Asegúrate de tener GROQ_API_KEY definida (o archivo .env)
npm run dev
```

El servidor quedará en `http://localhost:3001`.

---

### 3. Instalar dependencias y arrancar el frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

El frontend quedará en `http://localhost:5173` con proxy hacia el backend.

---

### 4. Usar la aplicación

1. Abre `http://localhost:5173` en el navegador.
2. Completa el formulario (nombre, edad, tema, personaje, vocabulario).
3. Haz clic en **Generar cuento**.
4. Lee el cuento en modo Frases o Párrafos con los botones Anterior/Siguiente.
5. Usa **Reiniciar** para volver al formulario.

---

## Ejemplo de request con curl

```bash
curl -X POST http://localhost:3001/api/story \
  -H "Content-Type: application/json" \
  -d "{\"nombre_nino\": \"Lucía\", \"edad\": 6, \"tema\": \"La amistad con los animales\", \"personaje_principal\": \"Un dragón amigable\", \"vocabulario\": \"simple\"}"
```

**Respuesta esperada (ejemplo):**
```json
{
  "titulo": "Lucía y el dragón amigable",
  "frases": [
    "Lucía vivía en un pueblo pequeño.",
    "Un día conoció a un dragón muy especial.",
    "El dragón tenía escamas de color turquesa.",
    "..."
  ],
  "parrafos": [
    "Lucía vivía en un pueblo pequeño. Un día conoció a un dragón muy especial. El dragón tenía escamas de color turquesa.",
    "..."
  ]
}
```

---

## Endpoints del backend

| Método | Ruta           | Descripción                         |
|--------|----------------|-------------------------------------|
| POST   | /api/story     | Genera un cuento personalizado      |
| GET    | /api/health    | Estado del servidor y GROQ_API_KEY  |

---

## Supuestos y limitaciones

- **Sin persistencia**: Los cuentos no se guardan. Al recargar la página se pierde el estado.
- **Sin base de datos, sesiones ni autenticación**.
- **GROQ_API_KEY obligatoria**: Sin ella, el endpoint `/api/story` devuelve error 500.
- **Límites de Groq**: Dependen del plan de la cuenta (rate limits, uso diario).
- **Modelo fijo**: Se usa `llama-3.3-70b-versatile`. Si Groq cambia el nombre, hay que actualizar en `server.js`.
- **Idioma**: El cuento se genera en español según el prompt.
- **Normalización**: Si Groq devuelve menos frases/párrafos de los pedidos, el backend intenta normalizar la respuesta.
