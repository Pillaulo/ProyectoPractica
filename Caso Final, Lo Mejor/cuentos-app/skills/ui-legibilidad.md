# Skill/Regla: Legibilidad de texto en UI

Esta regla aplica a todas las pantallas del proyecto, especialmente formularios y tablas.

## Reglas obligatorias

- Nunca confiar en color por defecto del navegador para texto en inputs, selects, textareas o tablas.
- En campos de formulario usar explícitamente:
  - fondo: `bg-white`
  - texto: `text-slate-900`
- En tablas:
  - encabezado: contraste alto (`bg-slate-100` + `text-slate-700`)
  - celdas: `text-slate-800` o `text-slate-900`
  - filas con fondo definido (`bg-white`) para evitar estilos heredados.
- Los mensajes de error deben verse claramente (`text-red-600` o similar).
- Si una pantalla se ve "en blanco", revisar primero clases `text-*` y `bg-*` en el contenedor y en los elementos hijos.

## Checklist rápido antes de cerrar una pantalla

1. ¿Inputs visibles al escribir?
2. ¿Texto de tabla visible en modo claro/oscuro del navegador?
3. ¿Botones y estados (`disabled`) conservan contraste?
4. ¿Mensajes de error/éxito son legibles?

