// Página de caso de estudio: solo necesita el cambio de tema.
import { initTheme } from './theme.js';
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initTheme); else initTheme();
