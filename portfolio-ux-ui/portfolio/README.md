# Portfolio UX/UI · Tu Nombre

Trabajo final de Diseño UX-UI 2026 (FCyT).

- **Sitio:** https://TU-SITIO.netlify.app
- **Figma:** (link con permiso de visualización)
- **Repositorio:** https://github.com/TU-USUARIO/portfolio

## Stack
HTML5 semántico, CSS3 puro (variables en `:root`, Flexbox y Grid) y JavaScript vanilla con módulos ES. Sin frameworks ni build. Fuentes: Bricolage Grotesque y Source Sans 3 (Google Fonts, `display=swap`).

## Estructura
```
index.html        contenido y metadatos
css/styles.css    tokens, componentes, secciones, breakpoints
js/main.js        punto de entrada
js/nav.js         menú mobile (aria-expanded / aria-controls)
js/scrollspy.js   sección activa en el menú
js/theme.js       modo claro/oscuro
js/modal.js       caso de estudio en <dialog>
assets/           favicon e imágenes
404.html          página de error personalizada
```

## Despliegue (Netlify desde GitHub)
1. Subir el repo a GitHub con commits incrementales.
2. En Netlify: Add new site → Import from Git → elegir el repo.
3. Build command vacío y publish directory `.`
4. Cada push a `main` despliega solo. Copiar la URL aquí y en la descripción del repo.

## Fuentes y créditos
Diseño propio. Sin template. Ilustraciones SVG creadas para este proyecto.

## Uso de IA
Declarar acá qué partes se generaron con IA (estructura inicial del código y textos de ejemplo) y cómo se revisaron y modificaron.

## Capturas
Agregar capturas del sitio, comparación Figma/sitio y reporte Lighthouse mobile.
