# Cuentos Mágicos - Aplicación de Lectura Infantil

Aplicación web para generar y leer cuentos personalizados para niños utilizando IA (Groq).

## Requisitos Previos

- **Node.js**: Debes tener instalado Node.js (versión 18 o superior). [Descargar Node.js](https://nodejs.org/)

## Instalación y Ejecución

### 1. Configurar el Backend (Servidor)

1. Abre una terminal y navega a la carpeta `server`:
   ```bash
   cd server
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` basado en el ejemplo:
   - Copia `.env.example` a `.env`
   - Edita `.env` y coloca tu API Key de Groq.
   ```
   GROQ_API_KEY=gsk_...
   PORT=3000
   ```
4. Inicia el servidor:
   ```bash
   npm run dev
   ```
   El servidor correrá en `http://localhost:3000`.

### 2. Configurar el Frontend (Cliente)

1. Abre **otra** terminal y navega a la carpeta `client`:
   ```bash
   cd client
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia la aplicación:
   ```bash
   npm run dev
   ```
4. Abre el navegador en la URL que aparece (usualmente `http://localhost:5173`).

## Uso

1. Ingresa el nombre del niño, edad, tema, personaje y nivel de vocabulario.
2. Haz clic en "Generar Cuento".
3. Lee el cuento paso a paso en modo "Frases" o "Párrafos".

## Ejemplo de Prueba (Curl)

Puedes probar el backend independientemente:

```bash
curl -X POST http://localhost:3000/api/story \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_nino": "Leo",
    "edad": 6,
    "tema": "dragones",
    "personaje_principal": "Draco",
    "vocabulario": "simple"
  }'
```

## Supuestos y Limitaciones

- **Persistencia**: No se guarda historial de cuentos. Al recargar la página se pierde el cuento actual.
- **API Key**: Debe configurarse en el servidor (`.env`). No se expone al cliente.
- **Conexión**: Requiere internet para conectar con Groq.
- **Modelos**: Está configurado para usar `llama-3.3-70b-versatile` de Groq.
