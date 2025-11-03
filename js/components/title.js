// Componente reutilizable para títulos centrados
export function createTitle(options = {}) {
  const {
    text = 'TÍTULO',
    size = 'md', // lg | md | sm
    className = '',
    level = 1,
  } = options;

  const tag = `h${Math.min(Math.max(parseInt(level, 10) || 1, 1), 6)}`;
  const el = document.createElement(tag);
  el.className = `screen-title screen-title--${size} ${className}`.trim();
  el.textContent = text;

  return el;
}
