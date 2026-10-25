// Única fuente de verdad del precio: calcularCuota().
export const FACTORES = { menos1: 1, '1a2': 1.1, mas2: 1.25 };

export function calcularCuota(valor, tasaAnual, antiguedad) {
  const factor = FACTORES[antiguedad];
  if (!factor || !valor) return null;
  return Math.round(valor * tasaAnual / 12 * factor);
}

const moneda = new Intl.NumberFormat('es-AR', {
  style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
});
export const formatoMoneda = (n) => moneda.format(n);
