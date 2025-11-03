
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
					cell.innerHTML = `<img src="assets/images/Icon ionic-ios-close (1).svg" alt="X" />`;
				} else {
					cell.innerHTML = `<img src="assets/images/Ellipse 20.svg" alt="O" />`;
				}
			}
		}
	}

	return { wrapper, board, update };
}

export default { createBoard };
