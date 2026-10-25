// Un único objeto con TODA la información del flujo.
import { render } from './render.js';
import { CAMPOS, CAMPOS_POR_PASO } from './validaciones.js';

const inicial = () => ({
  paso: 0,                // 0 = inicio, 1..4 = checkout, 5 = éxito, 6 = error
  equipo: { marca: '', modelo: '', valor: 0, antiguedad: '' },
  plan: 'plus',
  titular: { nombre: '', apellido: '', dni: '', nacimiento: '',
             email: '', celular: '', terminos: false },
  pago: { metodo: 'credito', tarjeta: '', vencimiento: '', cvv: '', titular: '' },
  poliza: null,
  // auxiliares de interfaz (también viven en el estado, no en el DOM)
  planes: [], errorPlanes: false, tocados: {}, procesando: false, errorPago: '',
});

export const solicitud = inicial();

export function getCampo(path) {
  const [sec, clave] = path.split('.');
  return clave ? solicitud[sec][clave] : solicitud[sec];
}

export function setCampo(path, valor) {
  const [sec, clave] = path.split('.');
  if (path === 'equipo.valor') valor = Number(String(valor).replace(/\D/g, '')) || 0;
  if (clave) solicitud[sec][clave] = valor; else solicitud[sec] = valor;
}

export const marcarTocado = (path) => { solicitud.tocados[path] = true; };
export const errorDe = (path) => CAMPOS[path].validar(getCampo(path));

export function camposInvalidos(paso) {
  if (paso === 2) return solicitud.planes.some((p) => p.id === solicitud.plan) ? [] : ['plan'];
  return (CAMPOS_POR_PASO[paso] || []).filter(errorDe);
}

export function irAPaso(n) {
  solicitud.paso = n;
  render(); // siempre después de cambiar el estado
  window.scrollTo({ top: 0 });
  document.querySelector('[data-paso]:not([hidden]) [data-foco]')?.focus();
}

export function reiniciar() {
  const planes = solicitud.planes; // el JSON ya cargado se conserva
  Object.assign(solicitud, inicial(), { planes });
}
