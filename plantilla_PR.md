# Actualización visual global de ZoFranca CR

## ¿Qué hace este PR?

Implementa la estructura visual compartida de ZoFranca CR con sidebar, header, componentes reutilizables, modo claro/oscuro y una vista previa móvil. También incorpora comportamiento responsive real para las siete páginas existentes.

## ¿Por qué?

El proyecto necesitaba una base visual uniforme y adaptable antes de comenzar a desarrollar las funcionalidades de negocio y la integración con la API.

## ¿Cómo se probó?

1. Ejecutar `npm start`.
2. Abrir `http://localhost:3001`.
3. Navegar entre las páginas y comprobar que muestran el sidebar y el header compartidos.
4. Cambiar entre modo claro y modo oscuro, recargar la página y verificar que la preferencia se conserva.
5. Activar `Vista móvil` y comprobar que la aplicación aparece dentro de un contenedor de aproximadamente 390 px.
6. Pulsar `Salir de vista móvil` o la tecla `Escape` para regresar a la vista normal.
7. Reducir manualmente el ancho del navegador para verificar el comportamiento responsive real.

## Checklist

- [x] El código compila / corre sin errores
- [X ] Los commits siguen el estándar
- [X ] Se actualizó la documentación si aplica
