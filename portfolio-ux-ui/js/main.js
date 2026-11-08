// Punto de entrada: cada módulo tiene una única responsabilidad.
import { initNav } from './nav.js';
import { initScrollSpy } from './scrollspy.js';
import { initTheme } from './theme.js';
import { initCaseModal } from './modal.js';
import { initContactForm } from './form.js';

const start = () => { initNav(); initScrollSpy(); initTheme(); initCaseModal(); initContactForm(); };
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
