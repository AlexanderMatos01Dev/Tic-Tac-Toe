import { audioManager } from '../core/audioManager.js';

export function createBoard({ onCellClick } = {}) {
	const wrapper = document.createElement('div');
	wrapper.className = 'board-wrapper';

	const board = document.createElement('div');
	board.className = 'game-board';

	const cells = [];
	for (let i = 0; i < 9; i++) {
		const cell = document.createElement('div');
		cell.className = 'game-cell';
		cell.dataset.index = i.toString();
		cell.addEventListener('click', () => {
			if (typeof onCellClick === 'function') onCellClick(i);
		});
		board.appendChild(cell);
		cells.push(cell);
	}

	wrapper.appendChild(board);

	function animateEntry() {
		// Añadir clase de animación al tablero
		board.classList.add('board-dropping');
		// Las celdas se animarán vía CSS con delays escalonados
		cells.forEach((cell, i) => {
			cell.style.setProperty('--drop-delay', `${i * 0.08}s`);
		});
		// Limpiar clase tras completar animación
		setTimeout(() => {
			board.classList.remove('board-dropping');
			cells.forEach(cell => cell.style.removeProperty('--drop-delay'));
		}, 1200);
	}

	function update(state) {
		for (let i = 0; i < 9; i++) {
			const cell = cells[i];
			const v = state.board[i];
			const wasFilled = cell.classList.contains('filled');
			
			if (v == null) {
				cell.classList.remove('filled', 'placed');
				cell.innerHTML = '';
			} else {
				const isNewlyPlaced = !wasFilled && v != null;
				cell.classList.add('filled');
				
				if (v === 'X') {
					cell.innerHTML = `<img src="assets/images/Icon ionic-ios-close (1).svg" alt="X" />`;
				} else {
					cell.innerHTML = `<img src="assets/images/Ellipse 20.svg" alt="O" />`;
				}
				
					// Añadir animación solo si es una ficha nueva
					if (isNewlyPlaced) {
						cell.classList.add('placed');
						audioManager.playClick();
						setTimeout(() => cell.classList.remove('placed'), 600);
					}
			}
		}
	}

	return { wrapper, board, update, animateEntry };
}

export default { createBoard };
