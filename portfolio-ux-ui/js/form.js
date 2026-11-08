// Formulario de contacto: envía a Netlify Forms sin recargar y confirma en pantalla.
export function initContactForm() {
  const form = document.querySelector('form[name="contacto"]');
  const status = document.getElementById('form-status');
  const button = form && form.querySelector('button[type="submit"]');
  if (!form || !status || !button) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const label = button.textContent;
    button.disabled = true; button.textContent = 'Enviando…'; status.textContent = '';
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString(),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      status.textContent = '¡Mensaje enviado! Te respondo en menos de dos días hábiles.';
    } catch (err) {
      status.textContent = 'No se pudo enviar el mensaje. Probá de nuevo o escribime a joaquinparodi79@gmail.com.';
    } finally {
      button.disabled = false; button.textContent = label;
    }
  });
}
