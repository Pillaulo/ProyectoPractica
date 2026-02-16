📘 README
Proyecto: Evaluación Crítica de Vibe Coding
🎯 Propósito del Repositorio

Este repositorio centraliza todos los artefactos generados durante la evaluación crítica del enfoque Vibe Coding, entendiendo este como el uso de herramientas basadas en modelos de lenguaje para generar software mediante prompts estructurados.

El objetivo no es solo utilizar herramientas, sino analizar:

Cuándo aportan valor real.

Cuándo no son suficientes.

Qué riesgos implican.

Cómo influye el diseño del prompt.

Cómo impacta la estructura del pipeline en el resultado final.

Este repositorio documenta tanto los productos generados como el proceso utilizado para generarlos.

🧠 Enfoque Metodológico

La evaluación se estructura en cuatro dimensiones principales:

Casos de prueba con complejidad creciente

Diseño de pipelines de vibe coding

Comparación de herramientas

Definición de métricas de desempeño

🧩 1. Casos de Prueba (Benchmark)

Se definieron escenarios progresivos para evaluar comportamiento, límites y calidad del código generado.

🔹 Caso simple

Aplicación web simple.

Solo frontend (deseable).

Sin persistencia.

Navegación básica.

Opcional: consumo de API simple (ej. Groq).

🔹 Caso intermedio (POR DEFINIR)

Separación explícita frontend/backend.

Arquitectura en capas (presentación + lógica).

Formularios.

Uso de base de datos.

API REST básica.

🔹 Caso avanzado (POR DEFINIR)

Arquitectura más estructurada (ej. hexagonal).

Separación clara de dominio.

Adaptadores.

Control de dependencias.

Servicios externos.

Validaciones cruzadas.

Cada caso incluye:

Prompt utilizado.

Herramienta empleada.

Pipeline aplicado.

Resultado generado.

Evaluación crítica.

🔄 2. Pipelines de Vibe Coding

Se evaluaron distintos niveles de estructuración del proceso.

🟢 Pipeline Mínimo

Un solo prompt genera toda la solución.

Ejemplo:

Genera una aplicación web que...

🟡 Pipeline Intermedio

PRD → Arquitectura → Implementación → Integración

Separación explícita de responsabilidades.

🔴 Pipeline Estructurado

Definición funcional

Definición arquitectónica

Generación por módulos

Validación iterativa

Refactorización asistida

Integración final

Aquí se evalúa cómo mejora (o no) la calidad del resultado cuando el proceso está más controlado.

🛠️ Herramientas Evaluadas

Se comparan escenarios donde:

Una sola herramienta cubre todo el pipeline.

Cada etapa utiliza una herramienta distinta.

Herramientas consideradas:

Claude Code

Cursor

Lovable

Base44

Google Antigravity

Supabase

Gemini

GPT

📊 Métricas de Evaluación

Se utilizan métricas simples pero objetivas:

Funcionales

¿Compila?

¿Ejecuta?

¿Cumple los requisitos?

¿Respeta la arquitectura solicitada?

Errores recurrentes

Necesidad de correcciones manuales

📁 Estructura del Repositorio
main
├── README.md

Branches
simple-claude
simple-cursor
simple-gemini
simple-lovable
...


Cada carpeta contiene:

Respuesta generada

Código final

Foto de la interfaz

Observaciones críticas

🔍 Criterios de Análisis Crítico

El foco del estudio es comprender:

Qué tan determinante es el prompt.

Si el modelo respeta restricciones arquitectónicas.

Qué tan reproducible es el resultado.

Si existe ilusión de completitud.

Cuánto trabajo humano real sigue siendo necesario.

⚠️ Consideraciones

Este repositorio no busca optimizar productividad, sino evaluar críticamente:

Alcances reales del vibe coding.

Riesgos técnicos.

Riesgos arquitectónicos.

Limitaciones estructurales del enfoque.

📌 Estado del Proyecto

En desarrollo iterativo.
Se agregan nuevos casos, herramientas y comparaciones progresivamente.
