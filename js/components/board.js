
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

	function update(state) {
		for (let i = 0; i < 9; i++) {
			const cell = cells[i];
			const v = state.board[i];
			if (v == null) {
				cell.classList.remove('filled');
				cell.innerHTML = '';
			} else {
				cell.classList.add('filled');
				if (v === 'X') {
					cell.innerHTML = `
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56.1 56.085">
							<path d="M45.982,39.331,66.019,19.295a4.7,4.7,0,1,0-6.64-6.64L39.342,32.692,19.306,12.655a4.7,4.7,0,1,0-6.64,6.64L32.7,39.331,12.666,59.368a4.695,4.695,0,0,0,6.64,6.64L39.342,45.971,59.379,66.008a4.695,4.695,0,0,0,6.64-6.64Z" transform="translate(-11.285 -11.289)" fill="#ec8c13"/>
						</svg>`;
				} else {
					cell.innerHTML = `
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56.085 56.085">
							<ellipse cx="28.043" cy="28.043" rx="24.043" ry="24.043" fill="none" stroke="#27a8f3" stroke-width="8"/>
						</svg>`;
				}
			}
		}
	}

	return { wrapper, board, update };
}

export default { createBoard };
