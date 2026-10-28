// Marca en el menú la sección visible (aria-current) para orientar a la persona.
export function initScrollSpy() {
  const links = [...document.querySelectorAll('.nav-list a[href^="#"]')];
  const sections = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (!('IntersectionObserver' in window) || !sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => a.removeAttribute('aria-current'));
      const active = links.find((a) => a.getAttribute('href') === `#${entry.target.id}`);
      if (active) active.setAttribute('aria-current', 'true');
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach((s) => observer.observe(s));
}
