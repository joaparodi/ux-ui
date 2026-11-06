// Modo oscuro por defecto; el botón cambia a claro y recuerda la elección.
export function initTheme() {
  const btn = document.querySelector('.theme-toggle');
  if (!btn) return;
  const root = document.documentElement;
  const current = () => root.dataset.theme || 'dark';

  const render = () => {
    const dark = current() === 'dark';
    btn.textContent = dark ? 'Claro' : 'Oscuro';
    btn.setAttribute('aria-label', dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
  };

  btn.addEventListener('click', () => {
    const next = current() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) { /* el almacenamiento puede estar bloqueado */ }
    render();
  });
  render();
}
