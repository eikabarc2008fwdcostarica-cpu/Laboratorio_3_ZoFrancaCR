# Correcciones técnicas e integración de ZoFranca CR

## ¿Qué hace este PR?

Corrige la base técnica de ZoFranca CR y deja integrada la API simulada con la interfaz compartida. También normaliza el formulario de solicitudes, la navegación, la iconografía, el diseño responsive y el flujo de colaboración del equipo.

### Cambios incluidos

- Se agregó `db.json` con datos ficticios y relaciones coherentes.
- Se instaló `json-server` como dependencia de desarrollo.
- Se agregó el comando `npm run api` para levantar la API en `http://localhost:3005`.
- Se mantuvo el frontend Express en `http://localhost:3001`.
- Se centralizó la comunicación HTTP en `public/js/api.js`.
- Se integró `nueva-solicitud.html` con el sidebar, header, temas y vista móvil compartidos.
- Se unificó el contrato de datos utilizado para registrar solicitudes.
- Se consolidó la lógica del formulario en `public/js/solicitudes.js`.
- Se eliminaron `public/js/nueva-solicitud.js` y `public/styles/nueva-solicitud.css` por duplicar responsabilidades.
- Se corrigieron enlaces y destinos de navegación entre páginas.
- Se reemplazaron los símbolos Unicode por iconos SVG de Lucide.
- Se ajustaron los breakpoints responsive para escritorio, tablet y móvil.
- Se preparó `node_modules` para dejar de ser rastreado por Git sin eliminarlo localmente.
- Se actualizaron README, pasos de ejecución y reglas de colaboración.

## ¿Por qué?

La auditoría técnica detectó que faltaban `db.json` y `json-server`, que `node_modules` estaba versionado y que existían diferencias entre los puertos documentados. También encontró una implementación aislada de la página de solicitudes que no reutilizaba el tema, los componentes ni la navegación global.

## ¿Cómo se probó?

1. Ejecutar `npm install`.
2. Ejecutar `npm run api` en una terminal.
3. Ejecutar `npm start` en otra terminal.
4. Abrir `http://localhost:3001` y comprobar la navegación entre las siete páginas.
5. Abrir `http://localhost:3005/solicitudes` y confirmar que la API responde correctamente.
6. Completar el formulario de nueva solicitud y verificar que el registro se guarda en la API.
7. Probar las validaciones obligatorias y el mensaje mostrado cuando la API no está disponible.
8. Cambiar entre modo claro y oscuro, recargar la página y confirmar que la preferencia se conserva.
9. Activar y cerrar la vista móvil; probar también el responsive real reduciendo el navegador.
10. Ejecutar `git ls-files node_modules` y confirmar que no devuelve archivos después de integrar el PR.

## Checklist

- [x] El código compila / corre sin errores
- [ ] Los commits siguen el estándar
- [x] Se actualizó la documentación si aplica
- [x] `db.json` contiene JSON válido y relaciones coherentes
- [x] La API utiliza exclusivamente el puerto 3005
- [x] No se incluyeron datos sensibles reales
- [x] No se rastrean nuevos archivos de `node_modules`
- [x] La interfaz conserva modo claro, modo oscuro y vista móvil
- [x] Se respetó el alcance asignado a cada integrante
