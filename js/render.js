// Pinta la pantalla a partir del estado. Nunca se lee el DOM para calcular nada.
import { solicitud, getCampo, errorDe, camposInvalidos } from './estado.js';
import { calcularCuota, formatoMoneda } from './cotizador.js';
import { CAMPOS } from './validaciones.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const ETAPAS = ['Cotizar', 'Plan', 'Datos', 'Pago'];
const TEXTO_CONTINUAR = { 1: 'Ver planes', 2: 'Continuar', 3: 'Continuar al pago', 4: 'Pagar y contratar' };

const planElegido = () => solicitud.planes.find((p) => p.id === solicitud.plan);
const cuotaElegida = () => {
  const p = planElegido();
  return p ? calcularCuota(solicitud.equipo.valor, p.tasaAnual, solicitud.equipo.antiguedad) : null;
};

export function render() {
  const { paso } = solicitud;
  $$('[data-paso]').forEach((s) => { s.hidden = Number(s.dataset.paso) !== paso; });
  $('#checkout').hidden = paso < 1 || paso > 4;
  renderPlanes();
  sincronizarCampos();
  renderErrores();
  renderStepper();
  renderResumen();
  renderAcciones();
  renderDatos();
}

// Rellena los inputs desde el estado (así "Volver" no pierde datos).
function sincronizarCampos() {
  $$('[data-campo]').forEach((el) => {
    const path = el.dataset.campo;
    const v = getCampo(path);
    if (el.type === 'checkbox') el.checked = v === true;
    else if (el.type === 'radio') el.checked = v === el.value;
    else if (path === 'equipo.valor') {
      if (Number(el.value.replace(/\D/g, '')) !== v) el.value = v ? String(v) : '';
    } else if (el.value !== String(v)) el.value = v;
  });
}

// Errores en línea: solo en campos que la persona ya tocó.
function renderErrores() {
  $$('[data-error]').forEach((p) => {
    const path = p.dataset.error;
    const err = solicitud.tocados[path] ? errorDe(path) : null;
    const texto = err || p.dataset.ayuda || '';
    p.textContent = texto;
    p.hidden = !texto;
    p.classList.toggle('text-red-600', !!err);
    p.classList.toggle('text-slate-500', !err);
    if (err) p.setAttribute('role', 'alert'); else p.removeAttribute('role');
    p.parentElement.toggleAttribute('data-invalid', !!err);
    $$(`[data-campo="${path}"]`, p.parentElement).forEach((el) => {
      el.setAttribute('aria-invalid', String(!!err));
      if (err) el.setAttribute('aria-describedby', p.id); else el.removeAttribute('aria-describedby');
    });
  });
}

function renderPlanes() {
  const { planes, equipo } = solicitud;
  $('#error-planes').hidden = !solicitud.errorPlanes;
  const lista = $('#lista-planes');
  const clave = JSON.stringify([planes, equipo.valor, equipo.antiguedad]);
  if (lista.dataset.clave === clave) return; // no reconstruir si nada cambió
  lista.dataset.clave = clave;
  lista.innerHTML = planes.map((p) => {
    const cuota = calcularCuota(equipo.valor, p.tasaAnual, equipo.antiguedad);
    return `<label class="card cursor-pointer gap-3 p-4 has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50 has-[:checked]:ring-1 has-[:checked]:ring-indigo-600">
      <span class="flex items-center gap-2">
        <input type="radio" name="plan" value="${esc(p.id)}" data-campo="plan">
        <span class="text-[15px] font-extrabold">${esc(p.nombre)}</span>
        ${p.recomendado ? '<span class="badge">Recomendado</span>' : ''}
      </span>
      <span class="text-2xl font-extrabold text-indigo-800">${cuota === null ? '—' : formatoMoneda(cuota)}<span class="text-[12px] font-normal text-slate-500"> /mes</span></span>
      <ul class="grid gap-1 text-[13px] text-slate-500">${p.coberturas.map((c) => `<li>✓ ${esc(c)}</li>`).join('')}</ul>
    </label>`;
  }).join('');
}

function renderStepper() {
  const { paso } = solicitud;
  $('#stepper').hidden = paso === 0;
  const actual = paso === 6 ? 4 : paso; // en el error el paso activo sigue siendo Pago
  $('#stepper ol').innerHTML = ETAPAS.map((t, i) => {
    const n = i + 1;
    const estado = actual > n ? 'completo' : actual === n ? 'activo' : 'pendiente';
    const circulo = { completo: 'bg-emerald-600 text-white', activo: 'bg-indigo-600 text-white', pendiente: 'bg-slate-200 text-slate-500' }[estado];
    return `<li class="flex items-center gap-2 ${n < 4 ? 'flex-1' : ''}" ${estado === 'activo' ? 'aria-current="step"' : ''}>
      <span class="grid size-7 shrink-0 place-items-center rounded-full text-[13px] font-semibold ${circulo}">${estado === 'completo' ? '✓' : n}</span>
      <span class="text-[13px] font-semibold ${estado === 'activo' ? 'text-indigo-800' : 'text-slate-500 max-sm:hidden'}">${t}<span class="sr-only"> (${estado})</span></span>
      ${n < 4 ? `<span class="h-0.5 flex-1 rounded ${actual > n ? 'bg-emerald-600' : 'bg-slate-200'}"></span>` : ''}
    </li>`;
  }).join('');
}

// Resumen: se genera UNA sola vez; el CSS lo muestra como barra (mobile) o card (desktop).
export function renderResumen() {
  const { equipo, titular, paso } = solicitud;
  const plan = planElegido();
  const cuota = paso >= 2 ? cuotaElegida() : null;
  const filas = [
    ['Seguro', 'Celular'],
    ['Equipo', [equipo.marca, equipo.modelo].filter(Boolean).join(' ') || '—'],
    ['Valor', equipo.valor ? formatoMoneda(equipo.valor) : '—'],
    ['Plan', paso >= 2 && plan ? plan.nombre : '—'],
  ];
  if (paso >= 4 && titular.nombre) filas.push(['Titular', `${titular.nombre} ${titular.apellido}`]);
  $('#resumen').innerHTML = `
    <header class="max-lg:hidden"><h2 class="text-[15px] font-extrabold">Resumen</h2></header>
    <section class="grid gap-3">
      <dl class="grid gap-2 text-[13px] max-lg:hidden">${filas.map(([k, v]) =>
        `<div class="flex justify-between gap-3"><dt class="text-slate-500">${k}</dt><dd class="text-right font-semibold">${esc(v)}</dd></div>`).join('')}</dl>
      <div class="flex items-center justify-between rounded-lg bg-indigo-50 px-3 py-2">
        <span class="text-[13px] font-semibold text-indigo-800">${paso >= 2 && plan ? `Plan ${esc(plan.nombre)} · ` : ''}cuota mensual</span>
        <strong class="text-[17px] text-indigo-800">${cuota === null ? '—' : formatoMoneda(cuota)}</strong>
      </div>
    </section>`;
}

function renderAcciones() {
  const { paso, procesando } = solicitud;
  const inv = camposInvalidos(paso);
  const continuar = $('[data-accion="continuar"]');
  continuar.textContent = procesando ? 'Procesando…' : (TEXTO_CONTINUAR[paso] || '');
  continuar.disabled = inv.length > 0 || procesando;
  $('[data-accion="volver"]').disabled = procesando;
  // Un botón deshabilitado explica qué falta.
  $('#ayuda-acciones').textContent = inv.length
    ? `Para continuar completá: ${inv.map((p) => CAMPOS[p].etiqueta).join(', ')}.` : '';
}

// Textos de las pantallas de éxito y error, tomados del estado.
function renderDatos() {
  const { titular, equipo } = solicitud;
  const plan = planElegido();
  const cuota = cuotaElegida();
  const datos = {
    nombre: titular.nombre,
    titular: `${titular.nombre} ${titular.apellido}`,
    email: titular.email,
    poliza: solicitud.poliza || '',
    plan: plan ? plan.nombre : '',
    equipo: `${equipo.marca} ${equipo.modelo}`,
    cuota: cuota === null ? '' : formatoMoneda(cuota),
    errorPago: solicitud.errorPago,
  };
  $$('[data-dato]').forEach((el) => { el.textContent = datos[el.dataset.dato] ?? ''; });
}
