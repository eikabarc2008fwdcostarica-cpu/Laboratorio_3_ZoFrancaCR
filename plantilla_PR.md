# Correcciones técnicas e integración de ZoFranca CR

## ¿Qué hace este PR?

Corrige la base técnica de ZoFranca CR, integra la API simulada con la interfaz compartida e implementa el Dashboard dinámico de solicitudes. También normaliza el formulario, la navegación, la iconografía, el diseño responsive y el flujo de colaboración del equipo.

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
- Se conectó el Dashboard con el endpoint `/solicitudes` de la API local.
- Se agregaron métricas dinámicas para total, recomendadas, en revisión y rechazadas.
- Se implementó una tabla de solicitudes recientes ordenada por fecha.
- Se agregó búsqueda por empresa y filtros por estado y sector.
- Las opciones del filtro de sector se generan a partir de los datos disponibles.
- Se agregó paginación simple de cinco solicitudes por página.
- Cada solicitud permite navegar a `detalle.html?id=ID`.
- Se implementaron los estados visuales Cargando, Error, Sin resultados y Datos disponibles.
- El Dashboard mantiene compatibilidad con modo oscuro, responsive real y vista móvil.

## ¿Por qué?

La auditoría técnica detectó que faltaban `db.json` y `json-server`, que `node_modules` estaba versionado y que existían diferencias entre los puertos documentados. También encontró una implementación aislada de la página de solicitudes y un Dashboard con valores de ejemplo que no consumía los datos reales de la API.

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
11. Confirmar que el Dashboard muestra 6 solicitudes, 2 recomendadas, 1 en revisión y 1 rechazada con los datos iniciales.
12. Buscar una solicitud por empresa y probar los filtros de estado y sector.
13. Avanzar y retroceder entre las dos páginas de resultados.
14. Abrir `Ver detalle` y confirmar que la URL contiene `detalle.html?id=ID`.
15. Detener temporalmente la API y verificar que el Dashboard muestra un error amigable sin fallos no controlados.

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
- [x] Las métricas del Dashboard se calculan desde la API
- [x] La tabla permite buscar, filtrar y paginar solicitudes
- [x] Los estados de carga, error, vacío y datos disponibles están implementados
- [x] Las solicitudes enlazan al detalle utilizando su ID
- [x] No se modificaron las páginas asignadas al otro desarrollador
