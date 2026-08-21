# Correcciones técnicas e integración de ZoFranca CR

## ¿Qué hace este PR?

Restaura la API local en el puerto 3005, unifica la página de solicitudes con la interfaz compartida y corrige dependencias, navegación, iconografía, responsive y archivos rastreados por error.

## ¿Por qué?

La auditoría detectó que faltaban `db.json` y `json-server`, que `node_modules` estaba versionado y que la página de nueva solicitud estaba aislada del sistema visual global.

## ¿Cómo se probó?

1. Ejecutar `npm start`.
2. Ejecutar `npm run api` en una terminal y `npm start` en otra.
3. Abrir `http://localhost:3001` y navegar entre las siete páginas.
4. Enviar una solicitud y comprobar que aparece en `http://localhost:3005/solicitudes`.
5. Verificar modo claro, modo oscuro, persistencia del tema y vista móvil.
6. Reducir el ancho del navegador para comprobar el responsive real.
7. Ejecutar `git ls-files node_modules` y confirmar que no devuelve archivos después de integrar el PR.

## Checklist

- [x] El código compila / corre sin errores
- [x] Los commits siguen el estándar
- [x] Se actualizó la documentación si aplica
