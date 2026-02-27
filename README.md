# Cuentos Mágicos 📖

Aplicación Full-Stack para generar y leer cuentos infantiles personalizados usando Groq (LLM). Creada con Vite + React (Frontend) y Express + SQLite (Backend).

## Arquitectura

Proyecto en formato Monorepo con separación estricta:
- **Frontend** (React): UI / Presentation layer y custom hooks de state (sin llamadas embebidas a APIs o IA).
- **Backend** (Express): Presentation (Controllers), Application logic (Services), Infrastructure (Repository para BD y Provider para Groq).

### Supuestos y Limitaciones
- Persistencia en base de datos SQLite puramente para el historial de sesiones generadas (no usuarios ni autenticaciones).
- Los cuentos generados son persistidos localmente.
- Frontend no requiere dependencias de Tailwind; usa CSS vanilla con una paleta de colores y Google Fonts estricta para niños de 5-9 años.
- El formato Strict JSON de la respuesta de Groq es manejado por el Backend.

---

## 🚀 Instalación y Ejecución Local

### Paso 1: Configurar el Backend

1. Abre un terminal y entra al directorio `backend`.
```bash
cd backend
```
2. Instala las dependencias:
```bash
npm install
```
3. Crea el archivo `.env` basado en el `.env.example`:
```bash
cp .env.example .env
```
4. Edita el archivo `.env` y coloca tu **GROQ_API_KEY**. Ex: `GROQ_API_KEY=gsk_...`
5. Levanta el servidor backend de desarrollo:
```bash
npm run dev
```
*(El servidor se ejecuta en el puerto 3000 por defecto)*

### Paso 2: Configurar el Frontend

1. Abre otra terminal y navega al directorio `frontend`.
```bash
cd frontend
```
2. Instala las dependencias si no las instaló `create-vite`:
```bash
npm install
```
3. Levanta el modo de desarrollo:
```bash
npm run dev
```

---

## 🛠️ Ejemplos de Peticiones a la API (cURL)

El Backend incluye CORS habilitado y está preparado para recibir peticiones JSON estrictas.

### 1. Generar un Cuento Nuevo (`POST /api/story`)

```bash
curl -X POST http://localhost:3000/api/story \
-H "Content-Type: application/json" \
-d '{
  "nombre_nino": "Lucas",
  "edad": 7,
  "tema": "Aventura espacial",
  "personaje_principal": "Robot amable",
  "vocabulario": "medio"
}'
```

*(Esto validará los campos y devolverá el Cuento en formato JSON normalizado y además lo guardará en la SQLite).*

### 2. Listar Historial de Sesiones (`GET /api/sessions`)

```bash
curl http://localhost:3000/api/sessions
```
