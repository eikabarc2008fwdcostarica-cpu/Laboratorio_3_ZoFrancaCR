# AGENTS.md — ZoFranca CR

> Documento consolidado de trabajo para cualquier agente de IA (o persona) que participe en el desarrollo, asistencia o revisión de **ZoFranca CR**. Unifica: `contexto.md`, `objetivos.md`, `restricciones.md`, `reglas_agente.md`, `buenas_practicas.md` y `memoria_proyecto.md`.
>
> Basado en el Documento de Requerimientos v1.0 (Laboratorio #3 · Extendido, 20 de agosto de 2026, aprobado con IA: 95/100). Toda restricción y regla listada aquí tiene carácter obligatorio para el desarrollo del proyecto.

---

## Índice

1. [Contexto del Proyecto](#1-contexto-del-proyecto)
2. [Objetivos del Proyecto](#2-objetivos-del-proyecto)
3. [Restricciones Técnicas y del Proyecto](#3-restricciones-técnicas-y-del-proyecto)
4. [Reglas del Agente / Asistente de Desarrollo](#4-reglas-del-agente--asistente-de-desarrollo)
5. [Buenas Prácticas de Desarrollo](#5-buenas-prácticas-de-desarrollo)
6. [Memoria del Proyecto (Bitácora)](#6-memoria-del-proyecto-bitácora)

---

## 1. Contexto del Proyecto

### 1.1 Visión General
**ZoFranca CR** es una plataforma web orientada a la gestión de solicitudes de instalación y al seguimiento del cumplimiento de empresas dentro de las Zonas Francas de Costa Rica. El proyecto busca reemplazar los procesos manuales basados en correo electrónico y hojas de cálculo por una solución centralizada, asíncrona y respaldada por Inteligencia Artificial.

### 1.2 Problemática Actual
Actualmente, la recepción de solicitudes y los reportes periódicos de cumplimiento se realizan mediante correos electrónicos y consolidaciones manuales en Excel. Este flujo genera:
* Tiempos de respuesta elevados.
* Errores de transcripción y digitación.
* Criterios de evaluación inconsistentes entre analistas.
* Falta de trazabilidad y dificultad para auditorías por parte de entes regulatorios (p. ej., PROCOMER).

#### 1.2.1 Proceso manual actual (observado)
1. La empresa envía la solicitud por correo con documentos adjuntos.
2. El analista abre y revisa manualmente los archivos.
3. El analista transcribe datos clave a una hoja de cálculo.
4. Se comparan inversión y empleos contra los umbrales aplicables.
5. Se decide subjetivamente si la solicitud avanza, requiere revisión o se rechaza.
6. Tras la instalación, los reportes de cumplimiento llegan nuevamente por correo.
7. Los reportes se consolidan y comparan manualmente en Excel.
8. Los incumplimientos pueden detectarse tarde y la auditoría carece de trazabilidad completa.

### 1.3 Solución Propuesta
Plataforma web con arquitectura en capas que permite:
1. **Recepción y Validación:** Formularios web interactivos para empresas solicitantes e instaladas con validaciones síncronas/asíncronas.
2. **Backend Simulado:** Persistencia en tiempo real utilizando `json-server` (`db.json`) mediante peticiones HTTP/REST (`fetch`).
3. **Preclasificación con IA:** Integración de un componente de IA (real o simulado) que analiza el perfil de las solicitudes y asigna un puntaje de afinidad (0-100) junto con una justificación cualitativa.
4. **Decisión Humana:** Un analista humano conserva la potestad exclusiva de confirmar, rechazar o alterar las recomendaciones de la IA.
5. **Control de Cumplimiento:** Comparación automática entre compromisos adquiridos (inversión, empleo) y ejecuciones reales reportadas, generando alertas visibles en caso de desviaciones.

#### 1.3.1 Proceso automatizado propuesto
1. La empresa completa un formulario web basado en los mockups aprobados.
2. El sistema valida los datos y guarda la solicitud en `json-server` de forma asíncrona.
3. El motor de IA evalúa el perfil y devuelve un puntaje de 0 a 100 con justificación.
4. El sistema preclasifica la solicitud según los umbrales definidos.
5. El analista revisa el resultado y registra la decisión humana final.
6. La empresa instalada presenta reportes periódicos de cumplimiento.
7. El sistema compara automáticamente los datos reales contra los compromisos originales.
8. Si existe incumplimiento se genera una alerta visible; si cumple, el reporte queda en regla.
9. El historial permite reconstruir solicitudes, reportes y decisiones para seguimiento.

### 1.4 Actores del Sistema
* **ACT-01: Empresa Solicitante:** Ingresa y envía solicitudes de instalación con sus datos y anexos.
* **ACT-02: Empresa Instalada:** Envía reportes periódicos de inversión, empleo y exportaciones.
* **ACT-03: Analista de Zona Franca:** Evalúa preclasificaciones de IA y emite dictámenes finales.
* **ACT-04: Analista de Cumplimiento:** Monitorea alertas de incumplimiento y da seguimiento.
* **ACT-05: Administrador / Gerente:** Revisa resúmenes consolidados, métricas globales e historial.
* **ACT-06: Auditor / PROCOMER:** Consumidor futuro de reportes de trazabilidad y cumplimiento; sin integración directa en esta versión.
* **ACT-07: Equipo de Desarrollo:** Josué Cruz Alemán y Eiker Abarca Murillo (desarrollo, pruebas y documentación).

### 1.5 Hallazgos Clave del Análisis
* Datos clave del dominio: sector, inversión, empleos, documentos, exportaciones, criterios mínimos, estado y decisiones.
* La IA aporta puntaje, justificación y priorización, pero **no toma la decisión final**.
* La asincronía es transversal: las operaciones con backend e IA deben ejecutarse sin congelar la interfaz.
* La escalabilidad es un requisito de diseño, no de implementación obligatoria: la arquitectura debe permitir futuras zonas francas, tipos de reporte e integraciones.
* La colaboración es evaluable: el desarrollo se realiza en pareja con ramas, pull requests y seguimiento en Trello.

### 1.6 Glosario del Dominio
| Término | Definición |
|---|---|
| **Zona franca** | Área o régimen especial donde operan empresas bajo condiciones y compromisos definidos. |
| **Régimen de Zona Franca** | Marco bajo el cual una empresa obtiene beneficios sujetos al cumplimiento de requisitos. |
| **PROCOMER** | Promotora del Comercio Exterior de Costa Rica; organismo relacionado con el régimen y su seguimiento. |
| **Solicitud de instalación** | Registro presentado por una empresa interesada en operar bajo el régimen. |
| **Compromiso de inversión** | Monto de inversión que una empresa proyecta y se compromete a ejecutar. |
| **Empleos proyectados** | Cantidad de puestos que la empresa declara que generará. |
| **Reporte de cumplimiento** | Registro periódico con empleos reales, inversión ejecutada y exportaciones. |
| **Puntaje de afinidad** | Valor de 0 a 100 que representa qué tan alineada está una solicitud con los criterios de la zona. |
| **Preclasificación** | Resultado automático Recomendada, Revisar o Rechazada antes de la decisión humana. |
| **Alerta de incumplimiento** | Aviso generado cuando un dato real queda por debajo del compromiso o umbral esperado. |
| **Trazabilidad** | Capacidad de conocer qué ocurrió, quién tomó una decisión y cuándo. |
| **json-server** | Backend simulado utilizado para persistir y consultar los datos del laboratorio. |

### 1.7 Estado de Validación del Documento Base
El documento de requerimientos (v1.0, 20 de agosto de 2026) fue evaluado por un agente de IA senior en 5 criterios (Completitud, Verificabilidad, Consistencia, Trazabilidad, Redacción profesional) obteniendo **95/100**, con resultado **APROBADO**.

---

## 2. Objetivos del Proyecto

### 2.1 Objetivo General
Diseñar y desarrollar la primera versión funcional de una plataforma web para una zona franca de Costa Rica que automatice el registro, evaluación, preclasificación, seguimiento y cumplimiento de empresas mediante operaciones asíncronas, un backend simulado en `json-server` y un componente de Inteligencia Artificial como apoyo a la toma de decisiones.

### 2.2 Objetivos Específicos
* **Centralización de Datos:** Unificar en una sola plataforma la recepción de solicitudes de instalación y los reportes periódicos de cumplimiento.
* **Reducción de Errores:** Eliminar la transcripción manual de datos provenientes de correos y hojas de cálculo para minimizar fallas operativas.
* **Consistencia en Criterios:** Aplicar reglas de negocio estrictas y configurables para la evaluación de parámetros mínimos (inversión, empleo, sector).
* **Preclasificación Inteligente:** Integrar un motor de IA que calcule un puntaje de afinidad (0 a 100) y genere una justificación detallada por solicitud.
* **Soberanía del Analista:** Garantizar que el sistema actúe como recomendador, reservando la decisión final de aprobación/rechazo en manos del analista humano.
* **Detección Automática de Incumplimientos:** Comparar automáticamente los reportes periódicos contra los compromisos iniciales para disparar alertas preventivas.
* **Trazabilidad Integral:** Almacenar historial detallado de cada decisión (responsable, fecha/hora, recomendación inicial de IA y resolución humana).
* **Calidad de Software Asíncrono:** Implementar patrones asíncronos en JavaScript (`Promises`, `async/await`, `Promise.all`, `try/catch`) asegurando que la interfaz nunca se congele ni bloquee al usuario.
* **Interfaz Profesional y Consistente:** Implementar toda la señalización visual del sistema (estados, alertas, acciones) mediante iconografía vectorial profesional, sin uso de emojis, garantizando una imagen seria, auditable y consistente en toda la aplicación.
* **Fidelidad a Mockups:** Construir la interfaz respetando exactamente los mockups aprobados en Stitch (formulario de solicitud, listado/dashboard, detalle con puntaje/justificación, formulario de cumplimiento y panel de alertas), documentando cualquier desviación antes de programarla.
* **Preparación para Escalabilidad de Dominio:** Diseñar la arquitectura de datos y lógica de negocio de forma que en el futuro pueda soportar múltiples zonas francas, autenticación con roles e integración con PROCOMER, sin que su implementación sea obligatoria en esta versión.
* **Cobertura Total de Requerimientos:** Cumplir con los 22 requerimientos funcionales (RF-01 a RF-22) y los 11 requerimientos no funcionales (RNF-01 a RNF-11) definidos en el documento de requerimientos aprobado.
* **Colaboración Verificable:** Mantener trazabilidad de autoría real de ambos integrantes del equipo mediante ramas y pull requests documentados en Git y seguimiento visible en Trello.

### 2.3 Objetivos No Funcionales Medibles
* Mantener el tiempo de respuesta percibido en unos pocos segundos por solicitud o reporte evaluado bajo condiciones normales (RNF-02).
* Cero bloqueos de interfaz durante cualquier llamada asíncrona a `json-server` o al motor de IA (RNF-01).
* Persistencia reconstruible: el estado de cualquier solicitud debe poder recuperarse por completo tras recargar el navegador o reiniciar `json-server` (RNF-06, RN-12).
* Arquitectura extensible: permitir agregar nuevas zonas francas o tipos de reporte sin rehacer el sistema completo (RNF-09).
* Separación de capas verificable en el código: UI, servicios y lógica de negocio deben poder identificarse y probarse de forma independiente (RNF-11).

### 2.4 Objetivo de Validación del Documento
* Obtener y mantener una puntuación de validación por IA de al menos 80/100, sin ninguna categoría individual por debajo de 12/20, conservando evidencia de todos los intentos como parte de la entrega.

---

## 3. Restricciones Técnicas y del Proyecto

### 3.1 Restricciones de Backend y Persistencia
* **RES-01 (Backend Simulado):** Se debe utilizar exclusivamente `json-server` sobre Node.js consumiendo el archivo local `db.json`.
* **RES-02 (Comunicación HTTP):** El frontend debe comunicarse con el backend únicamente mediante llamadas `fetch` estándar de JavaScript.
* **RES-11 (Colecciones fijas):** `db.json` debe mantener como mínimo las colecciones `/zonas`, `/solicitudes`, `/reportes` y `/evaluaciones`. No se permite renombrar, fusionar o eliminar colecciones sin actualizar toda la capa de servicios y documentarlo en la memoria del proyecto.
* **RES-12 (Persistencia sobre memoria):** Prohibido almacenar estado crítico del sistema (solicitudes, reportes, evaluaciones, decisiones) en variables globales, `localStorage` o `sessionStorage`. Todo debe sobrevivir a un reinicio de `json-server` y a una recarga del navegador (RN-12, RNF-06, REGLA-05).
* **RES-13 (IA simulada con datos reales):** Si el motor de IA es simulado, debe operar sobre los datos existentes en `json-server`; queda prohibido usar un arreglo fijo en memoria como fuente de evaluación.

### 3.2 Restricciones de Frontend e Interfaz
* **RES-03 (Fidelidad a mockups):** La interfaz debe desarrollarse respetando exactamente los mockups aprobados en Stitch (formulario de solicitud, listado/dashboard, detalle con puntaje/justificación, formulario de cumplimiento y panel de alertas). Cualquier desviación de diseño debe documentarse y aprobarse antes de programarse (RNF-07).
* **RES-04 (Compatibilidad):** La aplicación debe ejecutarse directamente en cualquier navegador web moderno sin requerir plugins ni instalaciones especiales por parte del usuario final (RNF-04).
* **RES-05 (Bloqueo de UI):** La interfaz no debe bloquearse bajo ninguna circunstancia mientras se espera la resolución de promesas o llamadas a red (RNF-01).
* **RES-14 (Iconografía profesional — prohibición de emojis):** Queda **estrictamente prohibido** el uso de emojis (😀, ✅, 🚀, ⚠️, etc.) en cualquier parte de la interfaz, mensajes del sistema, alertas visuales, commits, documentación técnica o comentarios de código. Toda señalización visual (estados, alertas, acciones, iconos de navegación) debe implementarse mediante **librerías de iconos vectoriales (SVG) profesionales**, estilo *outline/line*, con trazo y tamaño consistentes en toda la aplicación. Opciones recomendadas: **Lucide Icons**, **Feather Icons**, **Material Symbols (outlined)** o **Font Awesome (variante light/outline/regular)**. No mezclar más de una librería de iconos en el mismo proyecto.
* **RES-15 (Estados visuales obligatorios):** Toda operación asíncrona debe reflejar de forma consistente los estados **Cargando**, **Listo** y **Error**, usando iconografía (spinner, check, alerta) además de texto — nunca solo color o solo texto (RNF-10, REGLA-03).
* **RES-16 (Accesibilidad mínima de iconos):** Todo icono usado como único indicador de estado debe incluir un atributo `aria-label` o texto equivalente oculto, para no depender exclusivamente del color o la forma.

### 3.3 Restricciones del Alcance (Fuera de Alcance v1.0)
* **RES-06:** No se debe implementar integración real con sistemas externos oficiales de PROCOMER en esta entrega.
* **RES-07:** No se requerirá autenticación con Json Web Tokens (JWT) ni roles complejos de seguridad en base de datos; los roles de usuario se manejarán a nivel de interfaz/simulación.
* **RES-08:** No implementar notificaciones masivas reales por correo o SMS.
* **RES-09:** No incluir almacenamiento binario de archivos/PDFs pesados; los anexos se representarán mediante metadata o URLs simuladas.
* **RES-17 (Sin panel analítico avanzado):** No se implementará un panel analítico avanzado de tendencias históricas; solo métricas básicas de total de solicitudes, porcentaje de aprobadas y tiempo promedio de respuesta (RF-18).
* **RES-18 (Sin IA generativa autónoma):** La IA nunca debe generar ni enviar respuestas oficiales a empresas o entes reguladores sin revisión humana previa.
* **RES-19 (Una sola zona operativa):** Aunque la arquitectura debe quedar preparada para múltiples zonas francas (RF-17, RNF-09), en esta entrega solo se implementará y probará funcionalmente una zona franca activa.
* **RES-20 (Autenticación diferida):** No existe login real, cifrado de credenciales ni gestión de sesiones en v1.0; el "responsable" de una decisión se representa mediante un nombre/identificador simple (S-06).
* **RES-21 (Sin operación multi-zona completa en código):** Documentar el soporte futuro para múltiples zonas francas, pero no es obligatorio implementarlo funcionalmente en esta entrega.

### 3.4 Restricciones de Reglas de Negocio (no modificables sin aprobación documentada)
* **RES-22:** Inversión mínima, empleos mínimos y sectores permitidos son configurables únicamente por el administrador de la zona franca (RN-01).
* **RES-23:** Una solicitud incompleta **nunca** debe enviarse a evaluación de IA; el sistema debe bloquear el envío e indicar el dato faltante (RN-02, RF-21).
* **RES-24:** El puntaje de afinidad debe restringirse siempre al rango cerrado 0–100 (RN-03).
* **RES-25:** Los umbrales de preclasificación son fijos salvo cambio documentado en la memoria del proyecto: `>= 75` Recomendada, `50–74` Revisar, `< 50` Rechazada (RN-04 a RN-06).
* **RES-26:** La preclasificación de IA nunca debe sobrescribirse ni eliminarse al registrar la decisión humana final; ambas deben coexistir en el registro (RN-07, RF-20, REGLA-06).
* **RES-27:** Un reporte de cumplimiento solo puede asociarse a una empresa previamente aprobada/instalada (RN-08).
* **RES-28:** Todo valor real que quede por debajo del umbral/compromiso aplicable debe generar una alerta visible; no debe existir incumplimiento silencioso (RN-10).

### 3.5 Restricciones de Validación del Documento
* **RES-29:** El documento de requerimientos solo se considera aprobado con un puntaje total **>= 80/100** en la validación por IA y **ninguna categoría individual por debajo de 12/20** (Completitud, Verificabilidad, Consistencia, Trazabilidad, Redacción profesional).
* **RES-30:** Toda evidencia de validación (incluyendo intentos rechazados) debe conservarse y adjuntarse a la entrega final.

### 3.6 Restricciones de Trabajo y Colaboración
* **RES-10 (Control de Versiones):** Queda estrictamente prohibido hacer `push` directo a las ramas principales (`main`/`master`). Todo cambio debe ser integrado vía Pull Request desde ramas individuales asignadas a los dos integrantes del equipo.
* **RES-31 (Autoría verificable):** El historial de Git debe reflejar la autoría real de ambos integrantes (Josué Cruz Alemán y Eiker Abarca Murillo) mediante ramas, commits propios y pull requests — no se permite que un solo integrante concentre todos los commits (RNF-08).
* **RES-32 (Seguimiento en Trello):** El avance del proyecto debe reflejarse en el tablero Trello acordado, con tarjetas correspondientes a alcance/actores, RF, RNF, historias de usuario, criterios de aceptación, validación IA y versión final aprobada.

---

## 4. Reglas del Agente / Asistente de Desarrollo

El agente de Inteligencia Artificial que participe en el desarrollo, asistencia o revisión del código de **ZoFranca CR** debe cumplir estrictamente con las siguientes reglas:

### 4.1 Soberanía Humana
* **REGLA-01:** La IA **NUNCA** debe tomar decisiones finales de aprobación o rechazar automáticamente una solicitud en el código. Siempre debe emitir una **Preclasificación** (`Recomendada`, `Revisar`, `Rechazada`) y dejar el estado final pendiente de confirmación humana.

### 4.2 Manejo Asíncrono y de Interfaz
* **REGLA-02:** Todo código generado para llamadas a la API (`json-server`) o la IA debe emplear `async/await` estructurado con bloques `try/catch`.
* **REGLA-03:** Cualquier operación asíncrona debe notificar visualmente a la interfaz sus estados: `Cargando` (Loading), `Listo` (Success) o `Error` (Failure), representados con iconografía profesional (no emojis) además de texto.
* **REGLA-04:** Cuando se requiera procesar múltiples solicitudes o reportes en lote, se debe utilizar obligatoriamente `Promise.all` para optimizar la ejecución en paralelo.

### 4.3 Persistencia y Estado
* **REGLA-05:** Toda la información debe persistirse directamente en `json-server` (`db.json`). Está prohibido almacenar el estado crítico del sistema en variables globales en memoria o `localStorage` que se pierdan al reiniciar o recargar la página.
* **REGLA-06:** La decisión del analista debe guardarse como un registro nuevo o actualización de estado en `db.json` sin sobreescribir ni eliminar el puntaje y la justificación originalmente emitidos por la IA.

### 4.4 Validación de Datos
* **REGLA-07:** Antes de enviar datos a la IA o guardar en el backend, el agente debe asegurarse de incluir validaciones que impidan el envío de formularios con campos obligatorios vacíos o datos con tipos incorrectos.

### 4.5 Diseño Visual y Contenido
* **REGLA-08 (Sin emojis, iconografía profesional):** El agente nunca debe generar código, textos de interfaz, mensajes de commit o documentación que incluyan emojis. Todo elemento visual de estado, alerta o acción debe implementarse con iconos SVG de una librería profesional consistente (Lucide, Feather, Material Symbols outline o Font Awesome outline), respetando el mismo estilo en toda la aplicación.
* **REGLA-09 (Fidelidad a mockups):** Antes de programar una pantalla, el agente debe verificar que la implementación propuesta corresponda a los mockups aprobados en Stitch; cualquier desviación debe señalarse explícitamente al equipo antes de codificarla.

### 4.6 Disciplina de Alcance
* **REGLA-10 (No implementar fuera de alcance):** El agente no debe implementar, sugerir como obligatorio, ni dejar código "a medio camino" de: integración real con PROCOMER, autenticación JWT/roles de seguridad en base de datos, notificaciones reales por correo/SMS, almacenamiento binario de archivos pesados, panel analítico avanzado de tendencias, o IA generativa que envíe respuestas oficiales sin revisión humana. Estos puntos pertenecen a las fases futuras de la hoja de ruta.
* **REGLA-11 (Preparado para escalar, no escalado):** El agente puede diseñar el modelo de datos y la arquitectura pensando en múltiples zonas francas y roles futuros (RF-17, RNF-09), pero no debe implementar funcionalmente esa operación multi-zona en esta entrega.
* **REGLA-12 (Umbrales fijos):** El agente no debe modificar los umbrales de preclasificación (`>=75` Recomendada, `50-74` Revisar, `<50` Rechazada) salvo instrucción explícita y documentada del equipo.

### 4.7 Trabajo en Equipo y Trazabilidad
* **REGLA-13 (Sin push directo):** El agente nunca debe generar instrucciones ni realizar acciones que impliquen `push` directo a `main`/`master`; todo cambio debe proponerse vía rama y Pull Request.
* **REGLA-14 (Trazabilidad de decisiones):** Todo código que registre una decisión humana debe incluir `resultado`, `responsable` y `fecha_hora`, además de conservar el `id_solicitud` relacionado, sin excepción.
* **REGLA-15 (Consistencia con la documentación del proyecto):** Ante cualquier ambigüedad entre lo que pide una tarea puntual y lo definido en las secciones de Contexto, Objetivos, Restricciones o Buenas Prácticas de este documento, el agente debe priorizar lo documentado y advertir la discrepancia antes de generar código.

---

## 5. Buenas Prácticas de Desarrollo

### 5.1 Arquitectura de Código
* **Separación de Responsabilidades:** Mantener una clara división entre:
  * **Capa de UI/DOM:** Manipulación del DOM y eventos de usuario.
  * **Capa de Servicios (`services/`):** Funciones `fetch` para `json-server` e integración con la IA.
  * **Capa de Negocio (`logic/`):** Reglas de clasificación, cálculo de umbrales y comparación de cumplimiento.
* **Modularización ES6:** Utilizar módulos nativos (`import` / `export`) para mantener los archivos pequeños y legibles.
* **Estructura de carpetas sugerida:**
  ```
  /services   -> solicitud-service.js, reporte-service.js, evaluador-ia.js
  /logic      -> clasificacion.js, cumplimiento.js, validaciones.js
  /ui         -> dashboard.js, detalle-solicitud.js, alertas.js
  /icons      -> wrappers o referencias a la librería de iconos elegida
  /assets     -> estilos, mockups exportados
  ```
* **Un único punto de verdad para umbrales de negocio:** Los valores 75 y 50 (RN-04 a RN-06) deben vivir en una sola constante compartida en `logic/`, nunca duplicados en distintos archivos.

### 5.2 Manejo de Errores y Experiencia de Usuario
* **Mensajes Amigables:** Los errores capturados en el bloque `catch` deben mostrarse al usuario mediante alertas o banners visuales claros, sin exponer errores técnicos (p. ej., `TypeError: Failed to fetch`).
* **Logs Detallados en Consola:** Toda excepción debe imprimirse en la consola del navegador (`console.error`) con contexto suficiente para depuración.
* **Estados de UI consistentes:** Cada operación asíncrona (guardar, evaluar, consultar) debe exponer explícitamente sus tres estados — `Cargando`, `Listo`, `Error` — reutilizando un mismo componente/patrón visual en toda la aplicación, nunca soluciones ad hoc por pantalla.
* **No dejar la interfaz en un estado ambiguo:** Ante un error de red o backend, la interfaz debe recuperarse a un estado usable (permitir reintentar), nunca quedar congelada ni sin retroalimentación.

### 5.3 Iconografía y Diseño Visual (sin emojis)
* **Prohibido usar emojis** en botones, mensajes, alertas, encabezados, commits o documentación. Ver sección 3.2 (RES-14).
* **Usar una única librería de iconos vectoriales profesional** en todo el proyecto (Lucide, Feather, Material Symbols outline o Font Awesome outline/light), importada como componentes o sprites SVG.
* **Consistencia visual:** mismo grosor de trazo, mismo tamaño base (p. ej. 20px/24px) y misma paleta de color semántica para todos los iconos de estado:
  * Éxito / Listo → icono de check (no emoji ✅).
  * Error / Alerta de incumplimiento → icono de advertencia o círculo con exclamación (no emoji ⚠️).
  * Cargando → icono de spinner animado vía CSS/SVG, no texto "cargando..." únicamente.
* **Accesibilidad:** cada icono funcional debe llevar `aria-label` o texto visualmente oculto (`sr-only`) que describa su significado.

### 5.4 Estándares de Código y Git
* **Commits Semánticos:** Utilizar convenciones de commits como `feat:`, `fix:`, `docs:`, `refactor:`, `test:`.
* **Nombres Descriptivos:** Variables en `camelCase`, constantes globales en `UPPER_SNAKE_CASE` y clases en `PascalCase`.
* **Nombres de Archivos:** Todo en minúsculas y separado por guiones (e.g., `solicitud-service.js`, `evaluador-ia.js`).
* **Pull Requests obligatorios:** Ningún cambio se integra directo a `main`/`master`; toda rama individual se fusiona vía Pull Request revisado por el otro integrante (RES-10, RES-31).
* **Mensajes de commit descriptivos:** Evitar mensajes genéricos como `fix bug`; describir el requerimiento o regla de negocio afectada (p. ej. `feat: aplica umbrales RN-04 a RN-06 en clasificacion.js`).

### 5.5 Pruebas y Verificación
* **Verificar contra criterios de aceptación:** Antes de cerrar un RF de prioridad Alta, confirmar manualmente el escenario Dado/Cuando/Entonces documentado para ese requerimiento.
* **Probar el flujo de error de red:** Simular caída de `json-server` y confirmar que la interfaz no se bloquea y muestra un mensaje claro (RF-11, RNF-05).
* **Probar procesamiento en paralelo:** Validar que `Promise.all` resuelve correctamente múltiples solicitudes/reportes pendientes sin bloquear la interfaz (RF-13, RNF-03).
* **Probar persistencia tras recarga:** Reiniciar `json-server` y recargar el navegador para confirmar que el estado de una solicitud puede reconstruirse completamente (RF-16, RN-12).
* **Comparar contra mockups:** Antes de dar por cerrada una pantalla, compararla visualmente con el mockup aprobado en Stitch correspondiente.

---

## 6. Memoria del Proyecto (Bitácora)

### 6.1 Bitácora de Registro e Historial
Esta sección funge como la memoria viva del proyecto **ZoFranca CR**, documentando las decisiones de diseño, iteraciones y validaciones.

### 6.2 Datos del Proyecto y Registro de Autores
* **Título:** Plataforma de gestión de solicitudes y cumplimiento para Zonas Francas de Costa Rica
* **Autores:** Josué Cruz Alemán & Eiker Abarca Murillo
* **Entregable:** Laboratorio #3 · Extendido
* **Fecha de Línea Base:** 20 de agosto de 2026
* **Estado de Documentación:** Versión 1.0 Aprobada con IA (Puntaje: 95/100).

### 6.3 Decisiones de Arquitectura e Iteraciones

#### Iteración 1: Definición del Dominio y Reglas
* Se definieron los umbrales de preclasificación de la IA:
  * $\ge 75$: **Recomendada**
  * $50 - 74$: **Revisar**
  * $< 50$: **Rechazada**
* Se determinó que la decisión del analista debe guardar: `resultado`, `responsable`, `fecha_hora` e `id_solicitud`.

#### Iteración 2: Estrategia de Persistencia
* Selección de `json-server` para simular una REST API sobre `db.json` con las colecciones: `/zonas`, `/solicitudes`, `/reportes`, `/evaluaciones`.

#### Iteración 3: Integración de Validación con IA
* El documento técnico fue sometido a evaluación por un agente evaluador senior de requerimientos bajo 5 criterios (Completitud, Verificabilidad, Consistencia, Trazabilidad, Redacción), obteniendo un resultado favorable de **95/100**.

#### Iteración 4: Refuerzo de Reglas, Restricciones y Objetivos (post-análisis del Documento de Requerimientos)
* Se analizó el Documento de Requerimientos completo (18 secciones + Anexo A de validación) para asegurar que contexto, objetivos, restricciones, buenas prácticas y reglas del agente reflejaran la totalidad de RF (22), RNF (11), reglas de negocio (RN-01 a RN-12), actores, glosario, historias de usuario y hoja de ruta futura.
* Se incorporó formalmente la restricción de **iconografía profesional sin emojis**: toda señalización de estado/alerta/acción debe usar librerías de iconos vectoriales (Lucide, Feather, Material Symbols outline o Font Awesome outline), nunca emojis, tanto en interfaz como en documentación y commits.
* Se añadieron restricciones explícitas de disciplina de alcance (no adelantar autenticación real, integración PROCOMER, notificaciones reales, panel analítico avanzado ni IA generativa autónoma).
* Se documentaron restricciones adicionales de reglas de negocio (RN-01 a RN-12) como límites no modificables sin aprobación, y el umbral de validación del documento (>=80/100, ninguna categoría <12/20).

### 6.4 Estado de Requerimientos (Coverage Tracker)
* **Requerimientos Funcionales Totales:** 22 (RF-01 al RF-22)
* **Requerimientos No Funcionales Totales:** 11 (RNF-01 al RNF-11)
* **Reglas de Negocio Totales:** 12 (RN-01 al RN-12)
* **Estado de Implementación:** Preparado para fase de prototipado e integración con UI/Mockups, con reglas y restricciones reforzadas tras el análisis del documento base.
