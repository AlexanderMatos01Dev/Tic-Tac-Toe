// Lógica común para botones (efectos, sonidos, desactivación)

export function createButton({ text = 'Button', className = '', onClick = null, type = 'button' } = {}) {
  const btn = document.createElement('button');
  btn.type = type;
  btn.className = `mode-button ${className}`.trim();

 
  const textNode = document.createElement('span');
  textNode.className = 'btn-text';
  textNode.textContent = text;
  btn.appendChild(textNode);

  if (typeof onClick === 'function') btn.addEventListener('click', onClick);
  return btn;
}

