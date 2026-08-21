# ZoFranca CR

**Plataforma de gestión de solicitudes y cumplimiento para Zonas Francas de Costa Rica**

> Laboratorio #3 · Extendido — Levantamiento y especificación de requerimientos, v1.0 (20 de agosto de 2026), aprobada con validación IA: **95/100**.

---

## Tabla de contenido

1. [Datos del proyecto](#datos-del-proyecto)
2. [Descripción](#descripción)
3. [Objetivos](#objetivos)
4. [Alcance](#alcance)
5. [Actores del sistema](#actores-del-sistema)
6. [Tecnologías](#tecnologías)
7. [Estructura del proyecto](#estructura-del-proyecto)
8. [Modelo de datos (json-server)](#modelo-de-datos-json-server)
9. [Reglas de negocio](#reglas-de-negocio)
10. [Requerimientos funcionales (resumen)](#requerimientos-funcionales-resumen)
11. [Requerimientos no funcionales (resumen)](#requerimientos-no-funcionales-resumen)
12. [Instalación y ejecución](#instalación-y-ejecución)
13. [Flujo de trabajo con Git](#flujo-de-trabajo-con-git)
14. [Validación del documento con IA](#validación-del-documento-con-ia)
15. [Hoja de ruta futura](#hoja-de-ruta-futura)
16. [Documentación relacionada](#documentación-relacionada)

---

## Datos del proyecto

| Campo | Valor |
|---|---|
| **Título** | Plataforma de gestión de solicitudes y cumplimiento para Zonas Francas de Costa Rica |
| **Entregable** | Laboratorio #3 · Extendido |
| **Integrante 1** | Josué Cruz Alemán |
| **Integrante 2** | Eiker Abarca Murillo |
| **Fecha de línea base** | 20 de agosto de 2026 |
| **Versión del documento** | 1.0 · Preparada para validación con IA |
| **Estado de validación** | Aprobado — 95/100 |

---

## Descripción

En el proceso actual de gestión de zonas francas, las solicitudes de instalación y los reportes periódicos de cumplimiento se reciben principalmente por correo y se consolidan manualmente, lo que provoca tiempos de respuesta altos, errores de digitación, criterios inconsistentes entre analistas y poca trazabilidad para auditorías.

**ZoFranca CR** propone una plataforma web que centraliza las solicitudes y los reportes, los procesa de manera asíncrona mediante JavaScript y `json-server`, utiliza un componente de inteligencia artificial para preclasificar solicitudes y detectar posibles incumplimientos, y conserva siempre la decisión final en manos de un analista humano.

---

## Objetivos

### Objetivo general
Diseñar una primera versión funcional de una plataforma web para una zona franca de Costa Rica que automatice el registro, evaluación, clasificación, seguimiento y cumplimiento de empresas mediante operaciones asíncronas, un backend simulado en `json-server` y un componente de IA de apoyo a la decisión.

### Objetivos específicos
- Centralizar la información de solicitudes de instalación y reportes de cumplimiento.
- Reducir la transcripción manual y los errores derivados del uso de correo y hojas de cálculo.
- Aplicar criterios de admisión consistentes mediante reglas de negocio configurables.
- Preclasificar solicitudes con un puntaje de afinidad y una justificación generada por un motor de IA (real o simulado).
- Permitir que el analista confirme o modifique cualquier recomendación de IA.
- Detectar incumplimientos comparando resultados reales contra compromisos originales.
- Mantener trazabilidad suficiente para reconstruir el historial de cada empresa y de cada decisión.
- Utilizar `Promises`, `async/await`, `Promise.all`, `try/catch` y estados visuales de carga/error sin bloquear la interfaz.
- Construir una solución preparada para crecer a más zonas francas, reportes e integraciones en futuras versiones.

---

## Alcance

La primera versión implementa el flujo principal para **una** zona franca: configuración de criterios mínimos, envío de solicitud, persistencia en `json-server`, evaluación asíncrona con IA, preclasificación, revisión humana, envío de reportes de cumplimiento, comparación con compromisos y generación de alertas. Se documenta el soporte futuro para múltiples zonas francas, aunque no es obligatorio implementarlo en esta entrega.

### Fuera de alcance de esta versión
- Integración real con sistemas oficiales de PROCOMER.
- Autenticación y roles diferenciados completos.
- Notificaciones automáticas por correo o SMS.
- Panel analítico avanzado de tendencias históricas.
- IA generativa para enviar respuestas oficiales sin revisión humana.
- Operación multi-zona completa en código.

---

## Actores del sistema

| ID | Actor | Responsabilidad / interacción |
|---|---|---|
| **ACT-01** | Empresa solicitante | Completa y envía una solicitud con sus datos y documentos de respaldo. |
| **ACT-02** | Empresa instalada | Presenta reportes periódicos de cumplimiento. |
| **ACT-03** | Analista de zona franca | Revisa solicitudes preclasificadas, analiza la justificación de IA y toma la decisión final. |
| **ACT-04** | Analista de cumplimiento | Revisa reportes y alertas de incumplimiento para actuar oportunamente. |
| **ACT-05** | Administrador / gerente | Consulta resúmenes, métricas e historial para seguimiento y toma de decisiones. |
| **ACT-06** | Auditor / PROCOMER | Actor externo futuro que requiere trazabilidad y reportes consolidados; sin integración directa en esta versión. |
| **ACT-07** | Equipo de desarrollo | Diseña, implementa, prueba y documenta la solución de forma colaborativa. |

---

## Tecnologías

- **Frontend:** HTML, CSS y JavaScript (ES6, módulos nativos `import`/`export`).
- **Comunicación:** `fetch` estándar de JavaScript, patrones `async/await`, `Promise.all`, `try/catch`.
- **Backend simulado:** `json-server` sobre Node.js, persistiendo en `db.json`.
- **IA:** motor de IA real vía API o simulado mediante una función envuelta en `Promise`, operando siempre sobre datos de `json-server`.
- **Iconografía:** librería de iconos vectoriales profesional (Lucide, Feather, Material Symbols outline o Font Awesome outline) — **prohibido el uso de emojis** en toda la interfaz, documentación y commits.
- **Diseño:** mockups aprobados en Stitch (formulario de solicitud, listado/dashboard, detalle con puntaje/justificación, formulario de cumplimiento y panel de alertas).
- **Control de versiones:** Git con ramas y Pull Requests (sin push directo a `main`/`master`).
- **Seguimiento:** tablero de Trello.

---

## Estructura del proyecto

```
public/pages/   -> páginas HTML
public/js/      -> interfaz, servicios y lógica por dominio
public/styles/  -> estilos globales, layout, componentes y responsive
public/assets/  -> iconos e imágenes locales
server.js      -> servidor del frontend en el puerto 3001
db.json        -> base de datos simulada para json-server en el puerto 3005
```

- **Capa de UI/DOM:** manipulación del DOM y eventos de usuario.
- **Capa de Servicios (`services/`):** funciones `fetch` para `json-server` e integración con la IA.
- **Capa de Negocio (`logic/`):** reglas de clasificación, cálculo de umbrales y comparación de cumplimiento.
- Los umbrales de negocio (75 y 50) viven en una única constante compartida en `logic/`, nunca duplicados.

---

## Modelo de datos (json-server)

`db.json` debe mantener como mínimo las siguientes colecciones:

- `/zonas`
- `/solicitudes`
- `/reportes`
- `/evaluaciones`

---

## Reglas de negocio

| ID | Regla de negocio |
|---|---|
| **RN-01** | La zona franca define inversión mínima, empleos mínimos y sectores permitidos. |
| **RN-02** | Una solicitud solo puede evaluarse si contiene los datos mínimos obligatorios. |
| **RN-03** | El puntaje de afinidad debe estar entre 0 y 100. |
| **RN-04** | Puntaje >= 75 se preclasifica como **Recomendada**. |
| **RN-05** | Puntaje entre 50 y 74 se preclasifica como **Revisar**. |
| **RN-06** | Puntaje < 50 se preclasifica como **Rechazada**. |
| **RN-07** | La clasificación de IA es una recomendación; la decisión final corresponde al analista. |
| **RN-08** | Un reporte de cumplimiento debe asociarse a una empresa previamente aprobada/instalada. |
| **RN-09** | El cumplimiento se compara contra los compromisos originales de inversión y empleo de la empresa. |
| **RN-10** | Si un valor real queda por debajo del umbral aplicable, debe generarse una alerta visible. |
| **RN-11** | Las decisiones humanas deben conservar responsable y momento de la decisión para trazabilidad. |
| **RN-12** | Los datos persistentes deben permitir reconstruir el estado de una solicitud tras recargar el navegador o reiniciar el sistema. |

---

## Requerimientos funcionales (resumen)

22 requerimientos funcionales (RF-01 a RF-22). Los de prioridad **Alta** cuentan con criterios de aceptación Dado/Cuando/Entonces:

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-01 | Registrar una zona franca con inversión mínima, empleos mínimos y sectores permitidos. | Alta |
| RF-02 | Permitir a una empresa completar y enviar una solicitud de instalación. | Alta |
| RF-03 | Guardar y consultar cada solicitud de forma asíncrona en json-server sin bloquear la interfaz. | Alta |
| RF-04 | Enviar el perfil de una solicitud al motor de IA y recibir un puntaje de afinidad (0–100). | Alta |
| RF-05 | Preclasificar automáticamente cada solicitud según el puntaje. | Alta |
| RF-06 | Permitir a una empresa instalada enviar un reporte periódico de cumplimiento. | Alta |
| RF-07 | Comparar automáticamente el reporte contra los compromisos originales. | Media |
| RF-08 | Generar una alerta cuando la empresa incumpla algún umbral. | Alta |
| RF-09 | Visualizar un resumen consolidado de cumplimiento (simulación PROCOMER). | Media |
| RF-10 | Mostrar indicador de carga durante operaciones asíncronas. | Media |
| RF-11 | Manejar errores de red o datos inválidos con mensajes claros. | Alta |
| RF-12 | Permitir al analista confirmar, rechazar o cambiar la clasificación de la IA. | Alta |
| RF-13 | Evaluar varias solicitudes/reportes en paralelo con `Promise.all`. | Alta |
| RF-14 | Consultar el historial de una empresa (solicitud, reportes, decisiones). | Media |
| RF-15 | Listar y filtrar solicitudes por estado, zona, sector y fecha. | Media |
| RF-16 | Persistir en json-server los datos suficientes para reconstruir el estado. | Alta |
| RF-17 | Diseñar el sistema para administrar más de una zona franca (documentado, no implementado). | Baja |
| RF-18 | Mostrar panel con métricas básicas (total, % aprobadas, tiempo promedio). | Baja |
| RF-19 | Mostrar en el detalle el puntaje de IA junto con la justificación. | Alta |
| RF-20 | Registrar la decisión final del analista sin borrar la recomendación de IA. | Alta |
| RF-21 | Validar campos obligatorios antes de guardar/evaluar una solicitud. | Alta |
| RF-22 | Marcar un reporte como "En regla" o "Con alerta" tras la comparación automática. | Media |

---

## Requerimientos no funcionales (resumen)

| ID | Requerimiento no funcional | MoSCoW |
|---|---|---|
| RNF-01 | La interfaz no debe congelarse durante ninguna llamada asíncrona. | Must |
| RNF-02 | Tiempo de respuesta percibido de unos pocos segundos por operación. | Should |
| RNF-03 | Procesamiento de múltiples solicitudes/reportes en paralelo con `Promise.all`. | Must |
| RNF-04 | Uso desde navegador sin instalación adicional. | Must |
| RNF-05 | Errores registrados en consola y comunicados de forma clara al usuario. | Must |
| RNF-06 | `json-server` debe poder reiniciarse manteniendo la estructura de `db.json`. | Must |
| RNF-07 | La interfaz debe corresponder a los mockups aprobados en Stitch. | Must |
| RNF-08 | El historial de Git debe reflejar autoría real de ambos integrantes. | Must |
| RNF-09 | Arquitectura extensible a nuevas zonas francas o tipos de reporte. | Should |
| RNF-10 | Estados de interfaz Cargando/Listo/Error visibles y consistentes. | Should |
| RNF-11 | Separación comprensible de lógica de negocio, servicios y UI. | Should |

---

## Instalación y ejecución

```bash
# 1. Instalar las dependencias declaradas
npm install

# 2. Iniciar la API simulada en una terminal
npm run api

# 3. Iniciar el frontend en otra terminal
npm start
```

- Frontend: `http://localhost:3001`
- API: `http://localhost:3005`

> No se requiere ninguna instalación adicional para el usuario final: la aplicación corre directamente en cualquier navegador web moderno (RNF-04).

---

## Flujo de trabajo con Git

- Prohibido el `push` directo a `main`/`master`.
- Todo cambio se integra mediante **Pull Request** desde ramas individuales de cada integrante.
- El historial de commits debe reflejar la autoría real de **Josué Cruz Alemán** y **Eiker Abarca Murillo** (RNF-08).
- Convenciones de commits semánticos: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`.
- Seguimiento del avance en el tablero de **Trello** acordado por el equipo.

---

## Validación del documento con IA

El documento de requerimientos fue evaluado por un agente senior de levantamiento de requerimientos bajo 5 criterios (Completitud, Verificabilidad, Consistencia, Trazabilidad y Redacción profesional), cada uno sobre 20 puntos. Se considera aprobado con un total **>= 80/100** y ninguna categoría individual por debajo de **12/20**.

**Resultado del Intento 1:**

| Categoría | Puntaje |
|---|---|
| Completitud | 19/20 |
| Verificabilidad | 18/20 |
| Consistencia | 19/20 |
| Trazabilidad | 20/20 |
| Redacción profesional | 19/20 |
| **Total** | **95/100 — APROBADO** |

---

## Hoja de ruta futura

- **Fase futura 1 — Multi-zona y autenticación por roles:** administración de varias zonas francas independientes, con perfiles de empresa solicitante, analista, administrador y auditor.
- **Fase futura 2 — Integración PROCOMER y notificaciones:** integración real con el sistema oficial correspondiente y notificaciones por correo o SMS ante cambios de estado o alertas.

---

## Documentación relacionada

- `AGENTS.md` — contexto, objetivos, restricciones, reglas del agente, buenas prácticas y memoria del proyecto.
- `Documento_Requerimientos_ZoFranca_CR.docx` — documento completo de levantamiento y especificación de requerimientos (18 secciones + Anexo A de validación con IA).
