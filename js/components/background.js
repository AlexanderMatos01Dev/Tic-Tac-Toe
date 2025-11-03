// Componente reutilizable para el fondo de pantalla
export function createBackground(options = {}) {
  const { imagePath = './assets/images/Background-Image.png', alt = '', className = '' } = options;

  const el = document.createElement('div');
  el.className = `screen-background ${className}`.trim();
  el.setAttribute('role', 'img');
  if (alt) el.setAttribute('aria-label', alt);
  el.style.backgroundImage = `url('${imagePath}')`;

  return el;
}

// Permite actualizar la imagen del fondo en tiempo de ejecución
export function setBackgroundImage(backgroundEl, imagePath) {
  if (!backgroundEl) return;
  backgroundEl.style.backgroundImage = `url('${imagePath}')`;
}
