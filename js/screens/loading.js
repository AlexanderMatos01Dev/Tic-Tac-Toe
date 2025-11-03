// Pantalla de carga (fake loading entre transiciones)
import { createBackground } from '../components/background.js';
import { navigateTo } from '../core/screenManager.js';

export function renderLoading(root = document.getElementById('app'), { nextScreen = 'game', duration = 2000 } = {}) {
  if (!root) throw new Error('Contenedor principal no encontrado');

  root.innerHTML = '';
  root.className = 'screen-container';

  const bg = createBackground({ imagePath: 'assets/images/Background-Image.png', alt: 'Background' });
  root.appendChild(bg);

  const content = document.createElement('div');
  content.className = 'vstack';
  content.style.zIndex = 2;
  content.style.gap = '40px';

  // Título LOADING
  const title = document.createElement('h1');
  title.className = 'loading-title';
  title.textContent = 'LOADING';
  content.appendChild(title);

  // Contenedor de la barra de progreso
  const progressContainer = document.createElement('div');
  progressContainer.className = 'progress-container';

  // Barra de progreso animada
  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  progressContainer.appendChild(progressBar);

  content.appendChild(progressContainer);
  root.appendChild(content);

  // Animar la barra después de un pequeño delay
  setTimeout(() => {
    progressBar.classList.add('loaded');
  }, 100);

  // Navegar a la siguiente pantalla después de la duración
  setTimeout(() => {
    navigateTo(nextScreen, root);
  }, duration);

  return { root, bg, title, progressBar, progressContainer };
}

// Auto-render si se carga directamente
if (typeof window !== 'undefined' && document.readyState === 'complete') {
  renderLoading();
} else if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => renderLoading());
}
