# Changelog — ZoFranca CR

Todos los cambios relevantes del proyecto se documentan en este archivo.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

---

## [1.2.0] — 2026-08-21

### Agregado — Cumplimiento (Reporte Anual de Operaciones)
- Pantalla `cumplimiento.html` con formulario interactivo del Reporte Anual de Operaciones.
- Carga dinámica de datos de empresa desde la API local: empresa, cédula jurídica, clasificación, categoría, gama, periodo, nivel de empleo, empleo comprometido, inversión ejecutada, inversión comprometida, exportaciones y metas correspondientes.
- Cálculos dinámicos en tiempo real: porcentaje de empleo, brecha de empleo, porcentaje de inversión, superávit/déficit financiero, porcentaje de exportaciones y estado global de cumplimiento.
- Barras de progreso con colores semánticos (verde/amarillo/rojo) según porcentajes reales.
- Validación de campos requeridos antes del envío del reporte.
- Confirmación visual tras el envío exitoso del reporte.
- Hoja de estilos modular `cumplimiento.css`.

### Agregado — Historial (Trazabilidad de Expediente)
- Pantalla `historial.html` con línea de tiempo cronológica vertical.
- Eventos soportados: solicitud creada, evaluación IA, decisión del analista, reporte recibido, alerta detectada y cambios de estado.
- Cada evento incluye: tipo, fecha, descripción, estado (badge), documento y responsable.
- La evaluación IA aparece como evento independiente sin sustituir la decisión humana.
- Panel lateral dinámico con 8 datos del expediente: empresa, cédula, régimen, parque, acuerdo ejecutivo, analista asignado, días en proceso y cantidad de documentos.
- Filtros interactivos por tipo de evento y buscador de texto.
- Hoja de estilos modular `historial.css`.

### Agregado — Servicio API y Backend
- `api.js` con métodos asíncronos: `getEmpresas()`, `getReporteCumplimiento()`, `enviarReporteCumplimiento()`, `getHistorialExpedientes()`, `getHistorialExpediente()`.
- Fallback automático a datos locales cuando la API no está disponible.
- Banner visual de advertencia con botón de reintento en caso de API fuera de línea.
- Endpoints Express en `server.js`: `GET /api/empresas`, `GET /api/reportes/:id`, `POST /api/reportes`, `GET /api/historial`, `GET /api/historial/:id`.

### No modificado
- `index.html`, `detalle.html` y `decision.html` permanecen sin cambios.

---

## [1.1.0] — 2026-08-20

### Agregado — Estructura Visual Global
- Sidebar compartido con navegación entre las siete páginas del sistema.
- Header con buscador global, toggle de modo claro/oscuro y perfil del analista.
- Componentes reutilizables: cards, badges, botones, tablas, alertas y formularios (`components.css`).
- Sistema de diseño con tokens CSS y soporte para modo oscuro (`styles.css`).
- Layout de aplicación con sidebar fijo y área de contenido adaptable (`layout.css`).
- Vista previa móvil simulada (`mobile-preview.js`).
- Diseño responsive con breakpoints para móvil, tablet y escritorio (`responsive.css`).

### Agregado — Nueva Solicitud de Instalación
- Pantalla `nueva-solicitud.html` con formulario completo de registro de empresa.
- Validación de campos obligatorios con mensajes de error por campo.
- Zona de documentos simulados con drag-and-drop.
- Envío asíncrono con `fetch` a `http://localhost:3005/solicitudes`.
- Estados visuales de retroalimentación: Cargando, Listo y Error.
- Hoja de estilos modular `nueva-solicitud.css`.

---

## [1.0.0] — 2026-08-20

### Agregado — Fundación del Proyecto
- Inicialización del repositorio con `package.json`, Express y Nodemon.
- Servidor Express básico (`server.js`) sirviendo archivos estáticos desde `public/`.
- Estructura de carpetas: `public/pages/`, `public/js/`, `public/styles/`, `public/imgs/`.
- Páginas placeholder: `index.html`, `detalle.html`, `decision.html`, `cumplimiento.html`, `alertas.html`, `historial.html`, `nueva-solicitud.html`.
- Documento de requerimientos aprobado con validación IA: 95/100.
- `AGENTS.md` con contexto, objetivos, restricciones, reglas y buenas prácticas.
- `README.md` con documentación completa del proyecto.
