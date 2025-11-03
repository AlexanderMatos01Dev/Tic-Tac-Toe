// IA del CPU (movimientos aleatorios por ahora)

export function getRandomMove(board) {
	const empties = [];
	for (let i = 0; i < board.length; i++) {
		if (board[i] == null) empties.push(i);
	}
	if (empties.length === 0) return -1;
	const idx = Math.floor(Math.random() * empties.length);
	return empties[idx];
}

export default { getRandomMove };
