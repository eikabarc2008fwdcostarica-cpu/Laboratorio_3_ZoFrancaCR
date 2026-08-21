# Guía de colaboración

## Ramas autorizadas

- `main`: integración mediante Pull Request; no se trabaja directamente en ella.
- `feature-Josue`: trabajo asignado a Josué.
- `feature-Eiker`: trabajo asignado a Eiker.

No se crean ramas adicionales por funcionalidad.

## Regla de alcance por persona

Antes de comenzar una tarea, su tarjeta o mensaje de asignación debe enumerar los archivos que la persona puede modificar. Cada integrante debe limitar su PR exclusivamente a esos archivos.

Eiker no debe modificar archivos compartidos o de infraestructura salvo que Josué los incluya expresamente en la asignación. Esto aplica especialmente a:

- `package.json`
- `package-lock.json`
- `server.js`
- `db.json`
- `public/js/api.js`
- `public/js/ui.js`
- `public/js/theme.js`
- `public/js/mobile-preview.js`
- `public/styles/styles.css`
- `public/styles/layout.css`
- `public/styles/components.css`
- `public/styles/responsive.css`

Si una tarea requiere cambiar un archivo fuera del alcance recibido, se debe detener el trabajo y solicitar autorización antes de editarlo. Esta regla aplica independientemente de que se utilice Codex, Gemini u otra herramienta.

## Antes de abrir un Pull Request

1. Confirmar que la rama personal esté actualizada mediante el flujo acordado por el equipo.
2. Revisar `git diff --name-only` y comprobar que solo aparezcan archivos autorizados.
3. Ejecutar `npm install`, `npm run api` y `npm start` según corresponda.
4. Verificar la funcionalidad modificada en escritorio, tablet y móvil.
5. Usar `plantilla_PR.md` para documentar el cambio y sus pruebas.

## Integración

- No hacer push directo a `main`.
- No mezclar cambios ajenos dentro del mismo PR.
- No incluir `node_modules` ni `.DS_Store`.
- Resolver cada integración mediante un Pull Request revisado por el otro integrante.
- Usar commits semánticos como `feat:`, `fix:`, `docs:`, `refactor:` y `test:`.
