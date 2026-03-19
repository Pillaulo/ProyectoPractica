Proyecto de cuentos personalizados para niños con dificultades de lectura, basado en [Next.js](https://nextjs.org) y Groq.

## Requisitos

- Node.js 18+ (recomendado 20+).
- npm.

## Variables de entorno

Configura estos archivos:

- `/.env` (frontend + auth + DB):
  - `DATABASE_URL`
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL`
  - `BACKEND_URL`

- `/backend/.env` (backend de generación):
  - `PORT`
  - `ALLOWED_ORIGIN`
  - `GROQ_API_KEY`

Si no defines `GROQ_API_KEY` en backend, el sistema genera un cuento **mock local** para pruebas.
Con la configuración actual, el frontend exige backend real: si falta key o backend está caído, mostrará error y no generará cuento de prueba silencioso.

## Puesta en marcha en desarrollo

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Iniciar base de datos local de Prisma (opcional si ya tienes tu propia BD):

   ```bash
   npx prisma dev
   ```

3. Aplicar el esquema (si usas tu propia base de datos):

   ```bash
   npx prisma migrate dev --name init
   ```

4. Ejecutar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   O, para levantar frontend + backend juntos:

   ```bash
   npm run dev:all
   ```

## Frontend y backend separados

- `frontend`: este proyecto Next.js (UI + auth de sesión).
- `backend/`: servicio Express separado para generación de cuentos con validaciones.
- El frontend usa `BACKEND_URL` para pedir al backend la generación del contenido del cuento.

## Ejecutables de un clic (Windows)

En la raíz del proyecto:

- `oneclick-setup.bat`: instala dependencias, genera Prisma, intenta migrar y crea admin por defecto.
- `oneclick-run.bat`: abre 3 terminales y levanta:
  - `prisma dev`
  - backend (`backend npm run dev`)
  - frontend (`npm run dev`)
- `oneclick-clean.bat`: limpia archivos pesados antes de subir a Git (`node_modules`, `.next`, logs, etc.).

También existen versiones PowerShell:

- `oneclick-setup.ps1`
- `oneclick-run.ps1`
- `oneclick-clean.ps1`

## Instalación rápida (después de clonar)

1. Configura variables:
   - copia `/.env.example` a `/.env`
   - copia `/backend/.env.example` a `/backend/.env`
2. Ejecuta instalación completa:

   ```bash
   oneclick-setup.bat
   ```

3. Levanta toda la app:

   ```bash
   oneclick-run.bat
   ```

## Limpieza antes de subir a Git

Para dejar el repo liviano:

```bash
oneclick-clean.bat
```

5. Abrir `http://localhost:3000` en el navegador:

   - `/register`: crea una cuenta.
     - La **primera cuenta** creada queda como `ADMIN`.
     - Las siguientes cuentas quedan como `TUTOR`.
   - `/login`: inicia sesión.

## Rutas principales

- Tutor:
  - `/dashboard`
  - `/kids`, `/kids/new`, `/kids/[id]/edit`
  - `/stories/new`, `/stories`, `/stories/[id]`
- Admin:
  - `/admin`
  - `/admin/users`
  - `/admin/stories`
  - `/admin/templates`

## Carpeta de skills

En `skills/` se agrupan documentos de apoyo (skills) para este proyecto:

- `skills/groq-prompt.md`: esquema JSON y pautas de prompt para Groq.
- `skills/admin-checklist.md`: checklist para la sección de administración y moderación de contenido.
- `skills/ui-legibilidad.md`: regla de legibilidad para inputs, tablas y textos de interfaz.

Puedes añadir más archivos en `skills/` con prompts, reglas pedagógicas o flujos de trabajo según lo necesites.

