# Implementación de Cumplimiento y Trazabilidad de Expediente

## ¿Qué hace este PR?

Corrige la base técnica de ZoFranca CR, integra la API simulada con la interfaz compartida e implementa el Dashboard dinámico y el registro de decisiones humanas sobre solicitudes. También normaliza el formulario, la navegación, la iconografía, el diseño responsive y el flujo de colaboración del equipo.

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
- Se implementó `decision.html?id=ID` para consultar una solicitud específica desde la API.
- La pantalla de decisión muestra expediente, empresa, puntaje, recomendación y justificación IA.
- Se agregaron las resoluciones Confirmar recomendación, Cambiar a Revisar y Rechazar solicitud.
- Las observaciones del analista son obligatorias cuando la resolución es Revisar o Rechazada.
- Se evita el doble envío mientras la decisión está siendo registrada.
- La decisión humana actualiza el estado de la solicitud mediante `PATCH`.
- Se guardan decisión humana, observaciones y fecha de decisión.
- Se preservan sin modificaciones `puntajeIA`, `clasificacionIA` y `justificacionIA`.
- Cada resolución crea un evento de trazabilidad en `/historial`.
- Si falla el registro del historial, el sistema intenta revertir la actualización para evitar datos inconsistentes.
- Se agregaron estados visuales de carga, error, expediente disponible y decisión registrada.

## ¿Por qué?

La auditoría técnica detectó que faltaban `db.json` y `json-server`, que `node_modules` estaba versionado y que existían diferencias entre los puertos documentados. También encontró una implementación aislada de la página de solicitudes, un Dashboard con valores de ejemplo y una pantalla de decisión sin conexión a la API ni trazabilidad de la resolución humana.

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
16. Abrir `http://localhost:3001/pages/decision.html?id=sol-004` y comprobar los datos del expediente.
17. Intentar registrar una decisión sin seleccionar una resolución y verificar la validación.
18. Seleccionar Revisar o Rechazar sin observaciones y confirmar que el formulario bloquea el envío.
19. Registrar una decisión válida y verificar los cambios en `/solicitudes/ID`.
20. Confirmar que se crea el evento correspondiente en `/historial`.
21. Verificar que `puntajeIA`, `clasificacionIA` y `justificacionIA` conservan sus valores originales.
22. Comprobar que el botón permanece deshabilitado durante el registro y que se muestra la confirmación visual.

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
- [x] La página de decisión consulta solicitudes mediante su ID
- [x] Las observaciones se validan según la resolución seleccionada
- [x] La decisión humana actualiza el estado de la solicitud
- [x] Los campos de IA permanecen intactos
- [x] Cada decisión genera un evento de historial
- [x] Se evita el doble envío de decisiones
- [x] La pantalla de decisión conserva responsive, tema oscuro y vista móvil
