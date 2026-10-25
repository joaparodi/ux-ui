// Funciones puras: reciben un valor y devuelven un mensaje de error o null.
const letras = (s) => (String(s).match(/\p{L}/gu) || []).length;

export const validarMarca = (v) => (v ? null : 'Elegí una marca');
export const validarModelo = (v) => {
  const n = String(v).trim().length;
  return n >= 2 && n <= 40 ? null : 'Ingresá el modelo del equipo';
};
export const validarValor = (v) =>
  Number.isFinite(v) && v >= 100000 && v <= 2500000
    ? null : 'El valor debe estar entre $100.000 y $2.500.000';
export const validarAntiguedad = (v) => (v ? null : 'Indicá la antigüedad');

export const validarNombre = (v) => (letras(v) >= 2 ? null : 'Ingresá tu nombre');
export const validarApellido = (v) => (letras(v) >= 2 ? null : 'Ingresá tu apellido');
export const validarDni = (v) => (/^\d{7,8}$/.test(String(v).trim()) ? null : 'El DNI debe tener 7 u 8 números');

export function validarNacimiento(v, hoy = new Date()) {
  const msg = 'Tenés que ser mayor de edad';
  const n = new Date(`${v}T00:00:00`);
  if (!v || Number.isNaN(n.getTime())) return msg;
  let edad = hoy.getFullYear() - n.getFullYear();
  const antesDelCumple = hoy.getMonth() < n.getMonth() ||
    (hoy.getMonth() === n.getMonth() && hoy.getDate() < n.getDate());
  if (antesDelCumple) edad -= 1;
  return edad >= 18 ? null : msg;
}

export const validarEmail = (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim()) ? null : 'Ingresá un email válido');
export const validarCelular = (v) =>
  /^(?!0|15)\d{10}$/.test(String(v).replace(/[\s-]/g, '')) ? null : 'Ej.: 11 5555-1234';
export const validarTerminos = (v) => (v === true ? null : 'Tenés que aceptar los términos');

export const validarTarjeta = (v) => (/^\d{16}$/.test(String(v).replace(/\s/g, '')) ? null : 'Número de tarjeta inválido');
export function validarVencimiento(v, hoy = new Date()) {
  const msg = 'Vencimiento inválido';
  const m = /^(\d{2})\/(\d{2})$/.exec(String(v));
  if (!m) return msg;
  const mes = Number(m[1]);
  const anio = 2000 + Number(m[2]);
  if (mes < 1 || mes > 12) return msg;
  // La tarjeta vale hasta el fin del mes indicado.
  return anio * 12 + mes >= hoy.getFullYear() * 12 + hoy.getMonth() + 1 ? null : msg;
}
export const validarCvv = (v) => (/^\d{3}$/.test(String(v)) ? null : 'CVV inválido');
export const validarTitularTarjeta = (v) => (String(v).trim() ? null : 'Ingresá el nombre del titular');

// Qué función valida cada campo del estado y qué campos pide cada paso.
export const CAMPOS = {
  'equipo.marca':       { etiqueta: 'marca', validar: validarMarca },
  'equipo.modelo':      { etiqueta: 'modelo', validar: validarModelo },
  'equipo.valor':       { etiqueta: 'valor del equipo', validar: validarValor },
  'equipo.antiguedad':  { etiqueta: 'antigüedad', validar: validarAntiguedad },
  'titular.nombre':     { etiqueta: 'nombre', validar: validarNombre },
  'titular.apellido':   { etiqueta: 'apellido', validar: validarApellido },
  'titular.dni':        { etiqueta: 'DNI', validar: validarDni },
  'titular.nacimiento': { etiqueta: 'fecha de nacimiento', validar: validarNacimiento },
  'titular.email':      { etiqueta: 'email', validar: validarEmail },
  'titular.celular':    { etiqueta: 'celular', validar: validarCelular },
  'titular.terminos':   { etiqueta: 'términos', validar: validarTerminos },
  'pago.tarjeta':       { etiqueta: 'número de tarjeta', validar: validarTarjeta },
  'pago.vencimiento':   { etiqueta: 'vencimiento', validar: validarVencimiento },
  'pago.cvv':           { etiqueta: 'CVV', validar: validarCvv },
  'pago.titular':       { etiqueta: 'titular de la tarjeta', validar: validarTitularTarjeta },
  plan:                 { etiqueta: 'un plan', validar: () => null },
};

export const CAMPOS_POR_PASO = {
  1: ['equipo.marca', 'equipo.modelo', 'equipo.valor', 'equipo.antiguedad'],
  2: [],
  3: ['titular.nombre', 'titular.apellido', 'titular.dni', 'titular.nacimiento',
      'titular.email', 'titular.celular', 'titular.terminos'],
  4: ['pago.tarjeta', 'pago.vencimiento', 'pago.cvv', 'pago.titular'],
};
