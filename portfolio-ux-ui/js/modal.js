// Caso de estudio en <dialog>: el navegador gestiona foco, tecla Esc y fondo inerte.
export function initCaseModal() {
  const dialog = document.getElementById('case-dialog');
  const body = document.getElementById('case-dialog-body');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  document.querySelectorAll('.open-case').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tpl = document.getElementById(btn.dataset.case);
      if (!tpl) return;
      body.replaceChildren(tpl.content.cloneNode(true));
      dialog.showModal();
    });
  });

  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); }); // clic en el fondo
}
