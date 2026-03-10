# Frontend — Cuentos Mágicos

Frontend SPA para cuentos personalizados con lectura progresiva. Consume **exclusivamente** la API del backend; no accede a bases de datos ni servicios externos.

## Stack tecnológico

| Tecnología | Versión | Justificación |
|------------|---------|---------------|
| **Vite** | 5.x | Build rápido, HMR, bundling moderno (E Snowpack) |
| **React** | 18.x | Ecosistema maduro, componentes reutilizables |
| **TypeScript** | 5.x | Tipado estático, menos errores en runtime |
| **React Router** | 6.x | Routing declarativo, soporte para SPA |

### Alternativas consideradas

- **Next.js**: Más adecuado para SSR/SSG; para una SPA pura, Vite ofrece menor complejidad.
- **Vue/Svelte**: React elegido por consistencia con ecosistema backend TypeScript y amplia documentación.
- **Tailwind**: Estilos con CSS custom para evitar dependencias y ajustar mejor el estilo infantil.

## Pantallas

1. **Crear cuento** — Crear perfil de lector, seleccionar perfil y generar cuento con IA
2. **Lectura progresiva** — Leer el cuento por fragmentos con botones Anterior/Siguiente
3. **Historial** — Ver cuentos anteriores por perfil y reabrirlos para leer

## Estilo

- Colores suaves (verde menta, rosa pastel)
- Tipografía **Nunito** (legible, amigable)
- Sin conexión directa a base de datos ni servicios externos más allá del backend

## Estados

- **Loading**: Spinner y mensaje mientras se cargan datos
- **Error**: Mensaje y botón "Reintentar"
- **Vacío**: Mensaje cuando no hay perfiles o cuentos

## Configuración

### URL base del backend

Crear `.env` a partir de `.env.example`:

```
VITE_API_BASE_URL=http://localhost:3000
```

En producción, usar la URL del backend desplegado. Vite sustituye `import.meta.env.VITE_API_BASE_URL` en build time.

## Instalación

```bash
cd frontend
npm install
```

## Ejecución

```bash
# Desarrollo (puerto 5173 por defecto)
npm run dev

# Build para producción
npm run build

# Vista previa del build
npm run preview
```

## Estructura

```
src/
├── api/           # Cliente API (fetch) y tipos
├── components/    # Loading, ErrorBox, EmptyState
├── pages/         # CrearCuento, LecturaProgresiva, Historial
├── config.ts      # API_BASE_URL
├── App.tsx
└── main.tsx
```

## Requisitos

- Backend ejecutándose en la URL configurada
- Navegador moderno (ES2020+)
