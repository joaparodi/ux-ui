# Test de usabilidad

Se probó el sitio publicado (en ese momento en https://portpers.netlify.app; hoy en https://ux-ui-portfoli.vercel.app) con 3 personas. Los hallazgos y los cambios aplicados se resumen en la slide 9 del PDF del proceso.

## Participantes

| # | Persona | Qué se probó |
|---|---|---|
| 1 | Mati | Sitio publicado |
| 2 | Dilan | Sitio publicado |
| 3 | Santy | Sitio publicado |

## Tareas

1. Encontrar el email de contacto.
2. Abrir el proyecto más reciente.
3. Encontrar las habilidades y herramientas.

## Tabla de hallazgos

| Tarea u observación | Personas | ¿Completó? | Qué observé | Gravedad | Cambio aplicado |
|---|---|---|---|---|---|
| Encontrar el email | Mati, Dilan, Santy | Sí (3 de 3) | Muy sencillo: botón "Contactame" arriba o enlace "Escribime a..." al final; el mail se abre solo. | Baja | Sin cambios |
| Abrir el proyecto más reciente | Mati, Dilan, Santy | Sí (3 de 3) | Rápido: botón "Proyectos" del header o un scroll corto; cada tarjeta trae imagen, descripción y links. | Baja | Sin cambios |
| Encontrar skills y herramientas | Mati, Dilan, Santy | Sí (3 de 3) | Directo por "Skills" o recorriendo la página; cuatro bloques (Diseño UX, Diseño UI, Front-end y Herramientas) que se entienden de un vistazo. | Baja | Sin cambios |
| Línea de tiempo (observación de revisión) | Revisión | No aplica | Las fechas aparecían desordenadas: 2024, 2026, 2026 y 2024. | Baja | Orden cronológico inverso: 2026, 2026, 2024, 2024. |
| Menú mobile (observación de revisión) | Revisión | No aplica | Aparecía la palabra "Menú" en lugar del ícono de hamburguesa. | Media | Ícono de hamburguesa que pasa a X al abrir, con etiqueta accesible (`aria-label`). |
| Formulario (observación de revisión) | Revisión | No aplica | El envío no daba confirmación. | Alta | Formulario retirado (era opcional): el contacto queda por correo, LinkedIn y GitHub. |
| Scroll horizontal (verificación propia) | Prueba propia | No aplica | A 320 y 360 px el bloque de contacto desbordaba 44 px. | Media | Grilla `minmax(0, 1fr)` y botón con texto adaptable. Sin scroll horizontal en 14 anchos (280 a 1440 px), en modo claro y oscuro. |

## Comentario común

Las tres personas coincidieron en que el diseño es prolijo, intuitivo y familiar, y valoraron el modo claro y oscuro.
