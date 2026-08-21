# Guía de Contribución — ZoFranca CR

Gracias por contribuir a **ZoFranca CR**. Este documento establece las reglas y convenciones que todo colaborador debe seguir para mantener la calidad, consistencia y trazabilidad del proyecto.

---

## Integrantes del Equipo

| Integrante | Rama de Trabajo |
|---|---|
| **Josué Cruz Alemán** | `feature-Josue` |
| **Eiker Abarca Murillo** | `feature-Eiker` |

---

## Flujo de Trabajo con Git

### Ramas

- **`main`**: Rama protegida. Nunca se hace `push` directo a `main`.
- **`feature-Josue`**: Rama de trabajo de Josué.
- **`feature-Eiker`**: Rama de trabajo de Eiker.

### Reglas de Integración

1. Todo cambio se desarrolla en la rama individual del integrante asignado.
2. Una vez completado el trabajo, se crea un **Pull Request** desde la rama individual hacia `main`.
3. El otro integrante revisa el PR antes de aprobar la fusión.
4. Está **prohibido** hacer `push` directo a `main` o `master` (RES-10).
5. El historial de commits debe reflejar la autoría real de ambos integrantes (RES-31).

---

## Convenciones de Commits

Se utilizan **commits semánticos** con los siguientes prefijos:

| Prefijo | Uso |
|---|---|
| `feat:` | Nueva funcionalidad o pantalla |
| `fix:` | Corrección de errores |
| `docs:` | Cambios en documentación |
| `refactor:` | Reestructuración de código sin cambiar funcionalidad |
| `style:` | Cambios de formato o estilos CSS |
| `test:` | Pruebas |
| `chore:` | Tareas de mantenimiento (dependencias, configuración) |

### Ejemplo

```
feat: implementar trazabilidad de expedientes y reporte de cumplimiento
fix: corregir validación de campo inversión en cumplimiento
docs: actualizar CHANGELOG y plantilla de PR
```

---

## Estructura del Proyecto

```
Laboratorio_3_ZoFrancaCR/
  public/
    pages/          -> Páginas HTML del sistema
    js/             -> Lógica JavaScript modular
    styles/         -> Hojas de estilo CSS modulares
    imgs/           -> Recursos gráficos
  server.js         -> Servidor Express con endpoints API
  package.json      -> Dependencias y scripts del proyecto
  AGENTS.md         -> Contexto, reglas y restricciones del proyecto
  README.md         -> Documentación general
  CHANGELOG.md      -> Registro de cambios por versión
  contributing.md   -> Esta guía de contribución
  plantilla_PR.md   -> Plantilla para Pull Requests
```

---

## Asignación de Páginas

Para evitar conflictos, cada integrante tiene asignadas páginas específicas:

### Josué Cruz Alemán
- `index.html` (Dashboard)
- `detalle.html` (Empresas)
- `decision.html` (Decisión de Solicitud)

### Eiker Abarca Murillo
- `cumplimiento.html` (Reporte Anual de Operaciones)
- `historial.html` (Trazabilidad de Expediente)

### Compartidas
- `nueva-solicitud.html` (Formulario de Solicitud)
- `alertas.html` (Panel de Alertas)
- `server.js`, `api.js` y archivos de estilos globales

---

## Restricciones a Respetar

Antes de hacer un commit o PR, verificar que se cumplen las restricciones del proyecto:

- **Sin emojis** en la interfaz, commits ni documentación (RES-14).
- **Sin push directo** a `main` (RES-10).
- **Operaciones asíncronas** deben mostrar estados Cargando/Listo/Error con iconografía SVG (RES-15).
- **Diseño responsivo** verificado en móvil, tablet y escritorio (RES-33).
- **Persistencia en API/json-server**, no en variables globales ni localStorage como fuente primaria (RES-12).
- **La IA no toma decisiones finales**: toda preclasificación es una recomendación (REGLA-01).

---

## Cómo Crear un Pull Request

1. Asegurarse de que el código compila y corre sin errores (`npm start`).
2. Verificar que no se modificaron páginas asignadas al otro integrante.
3. Actualizar `CHANGELOG.md` con los cambios realizados.
4. Utilizar la plantilla de `plantilla_PR.md` como base para la descripción del PR.
5. Solicitar revisión al compañero antes de fusionar.

---

## Seguimiento

El avance del proyecto se registra en el tablero de **Trello** acordado por el equipo, con tarjetas correspondientes a requerimientos funcionales, no funcionales y criterios de aceptación.
