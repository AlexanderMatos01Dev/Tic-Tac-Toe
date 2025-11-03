// Formulario para jugador vs jugador
import { createBackground } from '../components/background.js';
import { createTitle } from '../components/title.js';
import { createButton } from '../components/button.js';
import { navigateTo } from '../core/screenManager.js';

export function renderPlayerVsPlayer(root = document.getElementById('app')) {
  if (!root) throw new Error('Contenedor principal no encontrado');

  root.innerHTML = '';
  root.className = 'screen-container';

  const bg = createBackground({ imagePath: 'assets/images/Background-Image.png', alt: 'Background' });
  root.appendChild(bg);

  const content = document.createElement('div');
  content.className = 'vstack';
  content.style.zIndex = 2;

  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'screen-content';

  // Title
  const title = createTitle({ text: 'NOMBRAR JUGADORES', size: 'lg', level: 1 });
  title.className = 'screen-title player-title';
  contentWrapper.appendChild(title);

  // Inputs holder - ahora incluye tanto inputs como botón para gap uniforme
  const holder = document.createElement('div');
  holder.className = 'input-holder';

  const input1 = document.createElement('input');
  input1.className = 'player-input';
  input1.placeholder = 'Jugador 1';
  input1.setAttribute('aria-label', 'Jugador 1');
  input1.type = 'text';

  const input2 = document.createElement('input');
  input2.className = 'player-input';
  input2.placeholder = 'Jugador 2';
  input2.setAttribute('aria-label', 'Jugador 2');
  input2.type = 'text';

  holder.appendChild(input1);
  holder.appendChild(input2);

  // Continue button (same sizing rules as other buttons)
  const continueWrap = document.createElement('div');
  continueWrap.className = 'player-continue';
  const startBtn = createButton({ 
    text: 'INICIAR', 
    className: 'secondary',
    onClick: () => {
      const player1 = input1.value.trim() || 'Jugador 1';
      const player2 = input2.value.trim() || 'Jugador 2';
      console.log('Iniciando juego con:', player1, player2);
      // Navegar a la pantalla de juego
      navigateTo('game', root);
    }
  });

  continueWrap.appendChild(startBtn);
  
  // Agregar botón al holder para que tenga el mismo gap
  holder.appendChild(continueWrap);
  contentWrapper.appendChild(holder);

  content.appendChild(contentWrapper);
  root.appendChild(content);

  return { root, bg, title, input1, input2, startBtn };
}

// Auto-render if module loaded directly
if (typeof window !== 'undefined' && document.readyState === 'complete') {
  renderPlayerVsPlayer();
} else if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => renderPlayerVsPlayer());
}
