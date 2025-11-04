import { createBackground } from '../components/background.js';
import { createTitle } from '../components/title.js';
import { createButton } from '../components/button.js';
import { navigateTo } from '../core/screenManager.js';

// Renderiza la pantalla de selección de modo de juego
export function renderGameModeSelection(root = document.getElementById('app')) {
	if (!root) throw new Error('Contenedor principal no encontrado');

	// Limpiar lo que haya
	root.innerHTML = '';
	root.className = 'screen-container';

	// Fondo compartido
	const bg = createBackground({ imagePath: 'assets/images/Background-Image.png', alt: 'Background' });
	root.appendChild(bg);

	// Contenido centrado
	const content = document.createElement('div');
	content.className = 'vstack';
	content.style.zIndex = 2;

		const title = createTitle({ text: 'Tic Tac Toe', size: 'hero', level: 1 });
		title.style.textAlign = 'center';
		title.style.lineHeight = '91px';
		content.appendChild(title);

	// Botones de modo
		const buttonsWrap = document.createElement('div');
		buttonsWrap.className = 'mode-buttons';

		// envolver los botones en un wrapper responsive que use el ancho de diseño
		const contentWrapper = document.createElement('div');
		contentWrapper.className = 'screen-content';

			const pvcBtn = createButton({ text: 'JUGADOR VS CPU', className: 'primary', onClick: () => {
				navigateTo('playerVsCpu', root);
			}});

			const pvpBtn = createButton({ text: 'JUGADOR VS JUGADOR', className: 'secondary', onClick: () => {
				navigateTo('playerVsPlayer', root);
			}});

		buttonsWrap.appendChild(pvcBtn);
		buttonsWrap.appendChild(pvpBtn);

		contentWrapper.appendChild(buttonsWrap);
		content.appendChild(contentWrapper);

		root.appendChild(content);

	return { root, bg, title, buttonsWrap };
}


