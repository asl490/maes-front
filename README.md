# Maes IA - Landing Page & Dashboard

Este repositorio contiene el código fuente de **Maes IA**, una plataforma inteligente diseñada para carpinteros y fabricantes de muebles de melamina, enfocada en la automatización de cotizaciones, diseño 3D y despiece.

## Estructura del Proyecto

El proyecto está construido con **Angular 17+** utilizando una arquitectura modular moderna con componentes *standalone*. El diseño visual se implementa usando **Tailwind CSS**.

### Rutas Principales

*   **`/` (Landing Page)**: Página orientada a la conversión y ventas.
    *   Arquitectura basada en subcomponentes (`Hero`, `Problem`, `Solution`, `Steps`, `Benefits`, `Features`, `Gallery`, `Comparison`, `Placacentro`, `CTA`).
    *   Ubicación: `src/app/pages/landing/`
*   **`/login`**: Página de acceso al sistema para usuarios registrados.
*   **`/app/...` (Área Administrativa)**: Panel de control, dashboard y reportes.

### Stack Tecnológico

*   **Framework**: Angular 17+
*   **Estilos**: Tailwind CSS
*   **Componentes**: Standalone Components (Arquitectura sin módulos)

## Desarrollo Local

1.  **Instalar dependencias:**
    ```bash
    npm install
    ```

2.  **Servidor de Desarrollo:**
    ```bash
    npm start
    ```
    O usando Angular CLI:
    ```bash
    ng serve
    ```
    Navega a `http://localhost:4200/`. La aplicación se recargará automáticamente si cambias alguno de los archivos fuente.

## Archivos Estáticos (Assets)

Los archivos estáticos (imágenes, logos, etc.) se gestionan en la carpeta `public/` en la raíz del proyecto.
Cualquier archivo colocado allí (como `logo.png`, `f1.jpeg`, `f2.jpeg`) es accesible directamente desde la ruta raíz (ej. `/logo.png`).

---

*Para actualizaciones de producción o despliegue, ejecutar `npm run build` o `ng build`.*
