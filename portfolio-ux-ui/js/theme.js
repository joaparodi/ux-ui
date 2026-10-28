// Modo claro/oscuro: respeta prefers-color-scheme y recuerda la elección manual.
export function initTheme() {
  const btn = document.querySelector('.theme-toggle');
  if (!btn) return;
  const root = document.documentElement;
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const current = () => root.dataset.theme || (mq.matches ? 'dark' : 'light');

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
