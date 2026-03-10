# BENCHMARK — Criterios de Evaluación

**Proyecto:** CuentoMágico — Cuentos Personalizados con Lectura Progresiva
**Versión:** 1.0
**Fecha:** Marzo 2026

---

## Propósito

Este documento define los criterios medibles para evaluar la calidad, completitud y correctitud del desarrollo en cada etapa y al cierre del proyecto.

---

## 1. Compilación y Ejecución

| ID | Criterio | Cómo se mide | Pasa / No pasa |
|----|----------|--------------|----------------|
| B-01 | Frontend compila sin errores | `npm run build` termina con exit code 0 | ✅ Exit code 0, 0 errores |
| B-02 | Backend inicia sin errores | `uvicorn` o equivalente arranca y responde en `/health` | ✅ HTTP 200 en `/health` |
| B-03 | Base de datos se inicializa | Las tablas se crean automáticamente al iniciar el backend | ✅ Tablas existen tras primer arranque |
| B-04 | Frontend se conecta al backend | Una petición desde la SPA al API devuelve datos | ✅ Respuesta exitosa en consola del navegador |

---

## 2. Cumplimiento de Requisitos Funcionales

| ID | Requisito (ref PRD) | Criterio de aceptación | Pasa / No pasa |
|----|---------------------|----------------------|----------------|
| B-05 | RF-01 Gestión de perfiles | Se puede crear, listar y eliminar un perfil desde la UI | ✅ CRUD funcional |
| B-06 | RF-02 Generación de cuentos | Al solicitar un cuento, se devuelve texto coherente y personalizado | ✅ Cuento generado con nombre y tema del perfil |
| B-07 | RF-03 Fragmentación | El cuento se divide en al menos 3 fragmentos | ✅ Array de fragmentos con length ≥ 3 |
| B-08 | RF-04 Lectura progresiva | Solo se muestra un fragmento a la vez en la UI | ✅ Un fragmento visible, resto oculto |
| B-09 | RF-05 Navegación | Botones "Siguiente" y "Anterior" cambian el fragmento visible | ✅ Navegación funcional ida y vuelta |
| B-10 | RF-06 Persistencia | Reiniciar el backend no pierde cuentos ni perfiles | ✅ Datos intactos tras restart |
| B-11 | RF-07 Historial | Se listan los cuentos generados para un perfil | ✅ Lista no vacía tras generar un cuento |
| B-12 | RF-08 Relectura | Se puede abrir y releer un cuento del historial | ✅ Cuento se muestra completo en modo progresivo |

---

## 3. Arquitectura Hexagonal

| ID | Criterio | Cómo se mide | Pasa / No pasa |
|----|----------|--------------|----------------|
| B-13 | Capa de dominio sin dependencias externas | La carpeta `domain/` no importa nada de `infrastructure/`, `fastapi`, `sqlalchemy`, ni librerías externas | ✅ 0 imports de infra en dominio |
| B-14 | Puertos definidos como interfaces | Existen interfaces/protocolos (ABCs o Protocols) para repositorios y servicios externos en la capa de dominio o aplicación | ✅ Al menos 2 puertos definidos |
| B-15 | Adaptadores implementan puertos | Los adaptadores de DB y LLM implementan las interfaces definidas en los puertos | ✅ Cada adaptador hereda/implementa su puerto |
| B-16 | Casos de uso en capa de aplicación | La lógica de orquestación está en `application/`, no en controladores ni adaptadores | ✅ Al menos 2 casos de uso separados |
| B-17 | Inyección de dependencias | Los casos de uso reciben sus dependencias por constructor, no las instancian directamente | ✅ Constructor con parámetros tipados como puertos |

---

## 4. Separación Real de Capas (Frontend / Backend)

| ID | Criterio | Cómo se mide | Pasa / No pasa |
|----|----------|--------------|----------------|
| B-18 | Proyectos independientes | `/frontend` y `/backend` son carpetas separadas con su propio `package.json` / `requirements.txt` | ✅ Archivos de dependencias independientes |
| B-19 | Comunicación solo vía HTTP | El frontend consume el backend exclusivamente mediante `fetch` o cliente HTTP a endpoints REST | ✅ 0 imports directos de backend en frontend |
| B-20 | Frontend no conoce el LLM | No existe referencia a Groq/OpenAI, API keys, ni prompts en el código del frontend | ✅ 0 menciones de LLM en `/frontend` |
| B-21 | CORS configurado | El backend permite peticiones del origen del frontend | ✅ Peticiones cross-origin exitosas |

---

## 5. Manejo Seguro de Secretos

| ID | Criterio | Cómo se mide | Pasa / No pasa |
|----|----------|--------------|----------------|
| B-22 | Archivo `.env` presente | Existe `.env` o `.env.example` en `/backend` con las variables necesarias | ✅ Archivo existe con variables documentadas |
| B-23 | `.env` en `.gitignore` | El `.gitignore` incluye `.env` | ✅ `.env` listado en `.gitignore` |
| B-24 | Sin secretos hardcodeados | Búsqueda de API keys en código fuente devuelve 0 resultados | ✅ `grep -r "sk-"` = 0 resultados |
| B-25 | Variables de entorno en backend | El backend lee credenciales desde `os.environ` o equivalente, no desde constantes | ✅ Lectura vía `os.getenv` o config de entorno |
| B-26 | Frontend libre de secretos | No hay variables `VITE_*` ni equivalentes que contengan API keys | ✅ 0 secretos en variables de entorno del frontend |

---

## 6. Claridad Estructural

| ID | Criterio | Cómo se mide | Pasa / No pasa |
|----|----------|--------------|----------------|
| B-27 | Estructura de carpetas coherente | La estructura sigue el patrón hexagonal documentado: `domain/`, `application/`, `infrastructure/` | ✅ Carpetas presentes y con contenido |
| B-28 | Nombrado consistente | Archivos y módulos siguen convención consistente (snake_case en Python, camelCase/PascalCase en React) | ✅ Convención uniforme |
| B-29 | README con instrucciones | Existe un README en la raíz o en cada subcarpeta con instrucciones de instalación y ejecución | ✅ Se puede levantar el proyecto siguiendo el README |
| B-30 | Código sin dead code | No hay funciones, imports o archivos sin usar de forma evidente | ✅ Revisión limpia |

---

## Resumen de Evaluación

| Categoría | Criterios | Peso |
|-----------|-----------|------|
| Compilación y Ejecución | B-01 a B-04 | 15% |
| Requisitos Funcionales | B-05 a B-12 | 30% |
| Arquitectura Hexagonal | B-13 a B-17 | 20% |
| Separación de Capas | B-18 a B-21 | 15% |
| Manejo de Secretos | B-22 a B-26 | 10% |
| Claridad Estructural | B-27 a B-30 | 10% |
| **Total** | **30 criterios** | **100%** |

### Escala de calificación

| Rango | Calificación | Significado |
|-------|-------------|-------------|
| 90–100% | Excelente | Todos los criterios críticos cumplidos, mínimos detalles menores |
| 75–89% | Bueno | Funcional y bien estructurado, algunos criterios secundarios pendientes |
| 60–74% | Aceptable | Funciona pero con deudas técnicas o criterios importantes faltantes |
| < 60% | Insuficiente | Faltan criterios críticos, no se considera entrega viable |
