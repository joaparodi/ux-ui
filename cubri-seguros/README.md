# Cubrí Seguros · Contratación digital de seguro de celular

TP5 · Diseño UXUI 2026 · Licenciatura en Sistemas de Información (FCyT).
Front-end de un checkout multipaso: cotiza, elige plan, carga datos, paga (simulado) y recibe número de póliza.

**Sitio publicado:** _pegá acá la URL (GitHub Pages / Netlify / Firebase)_

## Stack
HTML5 · Tailwind CSS v4 (CDN) · Basecoat UI 1.1.0 (solo CSS) · JavaScript vanilla (módulos ES). Sin frameworks ni librerías de validación.

## Cómo correrlo
El `fetch` de `data/planes.json` no funciona con doble click (`file://`). Usá un servidor local:

```bash
npx serve        # o la extensión Live Server de VS Code
```

## Estructura
```
index.html          una sola página; cada paso es una <section data-paso>
css/tokens.css      tokens del Figma (--primary, --radius)
data/planes.json    planes y tasas
js/app.js           arranque, eventos y navegación
js/estado.js        objeto único `solicitud` + funciones para modificarlo
js/render.js        pinta cada paso a partir del estado
js/validaciones.js  funciones puras: devuelven mensaje o null
js/cotizador.js     calcularCuota() y formato de moneda
js/pago.js          simularPago() y generarPoliza()
```

## Decisiones tomadas
- **Un único estado** (`solicitud`): cada evento lo modifica y llama a `render()`; el DOM nunca se lee para calcular.
- **`render()` rellena los inputs desde el estado**, por eso "Volver" y "Reintentar pago" no pierden datos.
- **Una sola `calcularCuota()`** alimenta las cards de plan y el resumen.
- **Resumen y botones generados una sola vez**; el CSS (`lg:`) los muestra como barra fija (mobile) o card lateral (desktop).
- **Errores en `blur`**, revalidación al intentar avanzar y foco al primer campo con error.
- **Vencimiento**: la tarjeta es válida hasta el último día del mes indicado.
- **Doble click en "Pagar"** bloqueado con el flag `procesando`.

## Casos de prueba (sección 5.1)
| Valor | Antigüedad | Básico | Plus | Premium |
|---|---|---|---|---|
| $ 600.000 | menos de 1 año | $ 2.000 | $ 3.000 | $ 4.500 |
| $ 600.000 | 1 a 2 años | $ 2.200 | $ 3.300 | $ 4.950 |
| $ 1.200.000 | más de 2 años | $ 5.000 | $ 7.500 | $ 11.250 |

Tarjetas de prueba: `4111 1111 1111 1111` (aprobada) y `4000 0000 0000 0002` (rechazada).

## Bonus
- Máscaras de input: tarjeta en grupos de 4 y vencimiento con barra automática.

## Capturas
_Agregá acá las capturas mobile (390 px) y desktop (1440 px) de las 7 pantallas._
