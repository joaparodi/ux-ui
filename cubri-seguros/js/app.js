// Arranque, eventos y navegación. Regla: cada evento modifica el estado y luego llama a render().
import { solicitud, irAPaso, setCampo, marcarTocado, camposInvalidos, reiniciar } from './estado.js';
import { render } from './render.js';
import { simularPago, generarPoliza } from './pago.js';

async function cargarPlanes() {
  try {
    const r = await fetch('data/planes.json');
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    solicitud.planes = await r.json();
    solicitud.errorPlanes = false;
  } catch (e) {
    console.warn('No se pudieron cargar los planes:', e.message);
    solicitud.errorPlanes = true;
  }
}

async function pagar() {
  if (solicitud.procesando) return; // evita el doble click
  solicitud.procesando = true;
  render();
  const res = await simularPago(solicitud.pago.tarjeta);
  solicitud.procesando = false;
  if (res.ok) {
    solicitud.poliza = generarPoliza();
    irAPaso(5);
  } else {
    solicitud.errorPago = res.motivo;
    irAPaso(6);
  }
}

// Revalida todo al intentar avanzar y lleva el foco al primer error.
async function avanzar() {
  const p = solicitud.paso;
  const invalidos = camposInvalidos(p);
  if (invalidos.length) {
    invalidos.forEach(marcarTocado);
    render();
    document.querySelector(`[data-campo="${invalidos[0]}"]`)?.focus();
    return;
  }
  if (p === 1) {
    if (!solicitud.planes.length) await cargarPlanes();
    irAPaso(2);
  } else if (p === 2 || p === 3) irAPaso(p + 1);
  else if (p === 4) await pagar();
}

const mascaras = {
  'pago.tarjeta': (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 '),
  'pago.vencimiento': (v) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  },
  'pago.cvv': (v) => v.replace(/\D/g, '').slice(0, 3),
};
const esOpcion = (el) => el.type === 'radio' || el.type === 'checkbox' || el.tagName === 'SELECT';

function alCambiar(e) {
  const el = e.target.closest?.('[data-campo]');
  if (!el) return;
  const path = el.dataset.campo;
  let valor;
  if (el.type === 'checkbox') valor = el.checked;
  else if (el.type === 'radio') { if (!el.checked) return; valor = el.value; }
  else valor = el.value;
  if (mascaras[path]) valor = mascaras[path](valor);
  setCampo(path, valor);
  if (e.type === 'change' && esOpcion(el)) marcarTocado(path);
  render();
}

document.addEventListener('input', alCambiar);
document.addEventListener('change', alCambiar);
document.addEventListener('focusout', (e) => { // error "en blur": al salir del campo
  const el = e.target.closest?.('[data-campo]');
  if (el && !esOpcion(el)) { marcarTocado(el.dataset.campo); render(); }
});
document.addEventListener('submit', (e) => { e.preventDefault(); avanzar(); });
document.addEventListener('click', (e) => {
  const boton = e.target.closest('[data-accion]');
  if (!boton) return;
  switch (boton.dataset.accion) {
    case 'empezar': irAPaso(1); break;
    case 'volver': irAPaso(Math.max(0, solicitud.paso - 1)); break;
    case 'continuar': avanzar(); break;
    case 'reintentar': irAPaso(4); break;
    case 'cambiar-medio':
      solicitud.pago.metodo = solicitud.pago.metodo === 'credito' ? 'debito' : 'credito';
      irAPaso(4);
      document.querySelector('[data-campo="pago.tarjeta"]')?.focus();
      break;
    case 'reiniciar': reiniciar(); irAPaso(0); break;
  }
});

render();
