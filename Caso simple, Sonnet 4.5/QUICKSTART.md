# 🚀 Guía Rápida de Inicio

## Pasos para ejecutar la aplicación

### 1️⃣ Obtener API Key de Groq

1. Ve a https://console.groq.com/keys
2. Crea una cuenta gratuita si no tienes una
3. Genera una nueva API key
4. Copia la API key (la necesitarás en el siguiente paso)

### 2️⃣ Configurar Backend

```powershell
# Navegar a backend
cd backend

# Instalar dependencias
npm install

# Crear archivo .env
copy .env.example .env
```

**Edita el archivo `.env`** y reemplaza `your_groq_api_key_here` con tu API key real:
```
GROQ_API_KEY=gsk_tu_api_key_real_aqui
```

### 3️⃣ Configurar Frontend

```powershell
# Navegar a frontend (desde la raíz del proyecto)
cd ..\frontend

# Instalar dependencias
npm install
```

### 4️⃣ Ejecutar la Aplicación

**Terminal 1 - Backend:**
```powershell
cd backend
npm start
```

Espera a ver: `✅ Server running on http://localhost:3000`

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

Espera a ver: `➜ Local: http://localhost:5173/`

### 5️⃣ Usar la Aplicación

1. Abre tu navegador en: **http://localhost:5173**
2. Llena el formulario con los datos del cuento
3. Haz clic en "Generar Cuento"
4. ¡Disfruta la lectura progresiva!

## ⚡ Comandos Rápidos

```powershell
# Instalar todo (desde la raíz del proyecto)
cd backend && npm install && cd ..\frontend && npm install && cd ..

# Ejecutar backend
cd backend && npm start

# Ejecutar frontend (en otra terminal)
cd frontend && npm run dev
```

## 🔍 Verificar que todo funciona

### Test del Backend
```powershell
curl http://localhost:3000/health
```

Deberías ver: `{"status":"ok","message":"Story backend is running"}`

### Test completo con curl
```powershell
curl -X POST http://localhost:3000/api/story `
  -H "Content-Type: application/json" `
  -d '{\"nombre_nino\":\"Ana\",\"edad\":6,\"tema\":\"dinosaurios\",\"personaje_principal\":\"T-Rex amigable\",\"vocabulario\":\"simple\"}'
```

Deberías recibir un JSON con `titulo`, `frases` y `parrafos`.
