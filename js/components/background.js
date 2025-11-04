// Componente reutilizable para el fondo de pantalla con variantes por dispositivo
export function createBackground(options = {}) {
  const {
    imagePath, // compat: si viene, se usa como desktop
    imageDesktop = imagePath || 'assets/images/Background-Image.png',
    imageTablet = 'assets/images/Background-image-tablet.png',
    imagePhone = 'assets/images/Background-image-phone.png',
    alt = '',
    className = '',
    breakpoints = { phone: 600, tablet: 1024 } // <600 phone, <1024 tablet, else desktop
  } = options;

  const el = document.createElement('div');
  el.className = `screen-background ${className}`.trim();
  el.setAttribute('role', 'img');
  if (alt) el.setAttribute('aria-label', alt);

  function pick(width = window.innerWidth) {
    if (width < breakpoints.phone) return imagePhone;
    if (width < breakpoints.tablet) return imageTablet;
    return imageDesktop;
  }

  function apply() {
    el.style.backgroundImage = `url('${pick()}')`;
  }

  apply();
  // Actualizar al cambiar tamaño de ventana
  const onResize = () => apply();
  window.addEventListener('resize', onResize);
  // Limpieza opcional si se remueve del DOM
  el.addEventListener('DOMNodeRemoved', () => {
    window.removeEventListener('resize', onResize);
  }, { once: true });

  return el;
}

// Permite actualizar la imagen del fondo en tiempo de ejecución (fuerza una ruta concreta)
export function setBackgroundImage(backgroundEl, imagePath) {
  if (!backgroundEl) return;
  backgroundEl.style.backgroundImage = `url('${imagePath}')`;
}
