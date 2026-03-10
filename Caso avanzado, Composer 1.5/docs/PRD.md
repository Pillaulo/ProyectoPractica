# PRD — CuentoMágico: Cuentos Personalizados con Lectura Progresiva

**Documento de Requisitos del Producto**
*Apoyo a la lectura infantil mediante cuentos personalizados y lectura progresiva*

**Versión:** 1.0
**Fecha:** Marzo 2026
**Roles:** Product Owner / Líder Técnico

---

## 1. Descripción del Problema

Los niños en edad de aprendizaje de lectura (4–10 años) enfrentan múltiples barreras:

- **Textos genéricos** que no conectan con sus intereses personales, lo que reduce la motivación.
- **Bloques extensos de texto** que generan sobrecarga cognitiva, frustración y abandono.
- **Falta de adaptación al nivel lector**: un mismo cuento no sirve igual para un niño de 4 años que para uno de 9.
- **Escasez de herramientas digitales** que combinen personalización de contenido con una experiencia de lectura gradual y guiada.

### Propuesta de solución

Una aplicación web que:
1. **Genera cuentos personalizados** usando inteligencia artificial, adaptados al nombre, edad, nivel lector y temas favoritos del niño.
2. **Presenta el cuento en modo lectura progresiva**: fragmentos cortos revelados secuencialmente, para reducir la sobrecarga y favorecer la comprensión.
3. **Persiste el historial** de cuentos para relectura y seguimiento del progreso.

---

## 2. Usuarios Objetivo

| Usuario | Rango de edad | Descripción | Necesidad principal |
|---------|---------------|-------------|---------------------|
| **Niños** | 4–10 años | Aprendices de lectura en distintos niveles | Cuentos divertidos, cortos, sobre temas que les gusten, presentados sin abrumarlos |
| **Padres/Tutores** | Adultos | Responsables del acompañamiento lector | Herramienta sencilla para crear cuentos adaptados y acompañar la lectura |
| **Educadores** | Adultos | Maestros, mediadores de lectura | Contenido adaptable al nivel del grupo o alumno individual |

### Niveles lectores contemplados

| Nivel | Edad aprox. | Características del texto generado |
|-------|-------------|-----------------------------------|
| **Inicial** | 4–5 años | Frases muy cortas (3–6 palabras), vocabulario básico, mucha repetición |
| **Básico** | 6–7 años | Frases cortas (6–10 palabras), vocabulario cotidiano, estructura simple |
| **Intermedio** | 8–9 años | Frases medianas, vocabulario más amplio, trama con inicio-nudo-desenlace claro |
| **Avanzado** | 10+ años | Párrafos cortos, vocabulario rico, tramas con giros y personajes desarrollados |

---

## 3. Flujo Principal (Happy Path)

```
[Adulto abre la app]
        │
        ▼
[Crea o selecciona un perfil de lector]
        │
        ▼
[Configura: nombre, nivel, temas preferidos]
        │
        ▼
[Solicita generar un cuento]
        │
        ▼
[Backend genera cuento vía LLM]──►[Guarda en BD]
        │
        ▼
[Cuento se muestra en modo lectura progresiva]
        │
        ▼
[Niño lee fragmento a fragmento, avanza/retrocede]
        │
        ▼
[Cuento finalizado → queda en historial]
        │
        ▼
[Puede releer cualquier cuento guardado]
```

### Descripción paso a paso

1. El **adulto** accede a la aplicación desde un navegador.
2. **Crea un perfil** de lector: nombre del niño, nivel lector (inicial/básico/intermedio/avanzado) y temas preferidos.
3. Desde el perfil, **solicita generar un cuento** nuevo. Puede ajustar el tema puntual (ej: "un dragón que tiene miedo al fuego").
4. El **backend** recibe la solicitud, construye un prompt adaptado al nivel y preferencias, invoca al LLM y recibe el cuento.
5. El backend **fragmenta el cuento** en segmentos apropiados al nivel lector y **persiste** todo en la base de datos.
6. El **frontend** recibe los fragmentos y presenta el primero en modo lectura progresiva con tipografía grande y clara.
7. El **niño lee** el fragmento visible y pulsa "Siguiente" para revelar el próximo (o "Anterior" para volver).
8. Al llegar al último fragmento, se muestra un **mensaje de felicitación** y el cuento queda marcado como completado.
9. El cuento queda en el **historial** del perfil para relectura en cualquier momento.

---

## 4. Requisitos Funcionales

| ID | Requisito | Descripción detallada | Prioridad |
|----|-----------|----------------------|-----------|
| RF-01 | Gestión de perfiles | Crear, editar y eliminar perfiles de lectores con nombre, nivel lector y temas preferidos | P0 |
| RF-02 | Generación de cuentos | Generar cuentos personalizados según el perfil del lector usando LLM desde el backend | P0 |
| RF-03 | Fragmentación automática | El backend fragmenta el cuento generado en segmentos apropiados al nivel lector | P0 |
| RF-04 | Lectura progresiva | Presentar los fragmentos uno a uno, revelándolos secuencialmente en la interfaz | P0 |
| RF-05 | Navegación entre fragmentos | Permitir avanzar al siguiente fragmento y retroceder al anterior durante la lectura | P0 |
| RF-06 | Persistencia de cuentos | Guardar cada cuento generado con sus fragmentos y metadatos en base de datos | P0 |
| RF-07 | Historial de cuentos | Listar cuentos generados por perfil, con estado (completado/en progreso) y fecha | P1 |
| RF-08 | Relectura | Permitir volver a leer cualquier cuento del historial desde el primer fragmento | P1 |
| RF-09 | Selección de temas | Ofrecer un catálogo de temas (animales, fantasía, aventuras, naturaleza, espacio, etc.) asociables al perfil | P1 |
| RF-10 | Indicador de progreso | Mostrar visualmente cuántos fragmentos se han leído vs. el total del cuento | P1 |

---

## 5. Requisitos No Funcionales

| ID | Requisito | Descripción | Métrica / Criterio |
|----|-----------|-------------|---------------------|
| RNF-01 | Separación Frontend/Backend | SPA como cliente y API REST independiente, en carpetas/proyectos separados | Ningún código de backend en frontend y viceversa |
| RNF-02 | Arquitectura hexagonal | Backend con puertos y adaptadores; dominio sin imports de infraestructura | Capa de dominio con 0 dependencias externas |
| RNF-03 | Persistencia | Base de datos para perfiles, cuentos y fragmentos | Datos sobreviven al reinicio del servidor |
| RNF-04 | Seguridad de credenciales | API keys y secretos solo en backend vía variables de entorno | 0 secretos en código fuente o frontend |
| RNF-05 | UX adaptada a niños | Tipografía grande (mín. 18px), botones amplios, colores amigables, interfaz sin distracciones | Cumple criterios de usabilidad infantil |
| RNF-06 | Idioma español | Toda la UI y el contenido generado deben estar en español | 100% de textos visibles en español |
| RNF-07 | Rendimiento de generación | La generación de un cuento no debe tardar más de 30 segundos percibidos | Indicador de carga visible; timeout configurado |
| RNF-08 | Responsive | La interfaz debe funcionar en escritorio, tablet y móvil | Breakpoints para 3 tamaños mínimo |

---

## 6. Restricciones Técnicas

| Restricción | Detalle |
|-------------|---------|
| **Frontend y Backend separados** | Proyectos independientes en carpetas distintas (`/frontend`, `/backend`). Comunicación exclusiva vía API HTTP REST. |
| **Arquitectura hexagonal en backend** | Capas: dominio (entidades, puertos) → aplicación (casos de uso) → infraestructura (adaptadores HTTP, DB, LLM). El dominio no importa nada de infraestructura. |
| **Persistencia obligatoria** | Base de datos (SQLite para desarrollo, compatible con PostgreSQL para producción) para perfiles, cuentos y fragmentos. |
| **LLM solo desde backend** | El frontend nunca conoce ni invoca proveedores de LLM. Toda generación pasa por un endpoint del backend que internamente llama al LLM. |
| **Variables de entorno para secretos** | Archivo `.env` (excluido de control de versiones) para API keys y configuración sensible. |

---

## 7. Alcance y Fuera de Alcance

### En alcance (v1 — MVP)

- Gestión de perfiles de lectores (CRUD)
- Generación de cuentos personalizados con LLM
- Fragmentación automática según nivel
- Lectura progresiva por fragmentos con navegación
- Indicador de progreso de lectura
- Historial de cuentos por perfil
- Relectura de cuentos guardados
- Interfaz web responsive, amigable para niños
- Persistencia en base de datos
- Backend con arquitectura hexagonal

### Fuera de alcance (v1)

- Autenticación y autorización de usuarios (login/registro)
- Síntesis de voz / text-to-speech
- Ilustraciones o imágenes generadas por IA
- Modo multijugador o colaborativo
- Aplicación móvil nativa
- Soporte multiidioma
- Gamificación (puntos, logros, recompensas)
- Panel de analíticas para educadores
- Exportación de cuentos a PDF

---

## 8. Stack Tecnológico Propuesto

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| **Frontend** | React + TypeScript + Vite | SPA moderna, tipado fuerte, build rápido |
| **Estilos** | Tailwind CSS | Utility-first, prototipado rápido, responsive |
| **Backend** | Python + FastAPI | Async nativo, validación con Pydantic, ideal para arquitectura hexagonal |
| **Base de datos** | SQLite (dev) / PostgreSQL (prod) | SQLite sin infraestructura extra en desarrollo; migración sencilla a PostgreSQL |
| **ORM** | SQLAlchemy | Mapeo flexible, compatible con múltiples motores |
| **LLM** | Groq API (Llama, Mixtral) | Inferencia rápida, buena calidad de generación en español |
| **Comunicación** | API REST (JSON) | Estándar simple, sin acoplamiento |
