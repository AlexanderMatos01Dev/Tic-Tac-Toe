// Pantalla de resultado entre jugadores humanos (muestra ganador)
import { createWinModal } from '../components/modal.js';

export function renderWinPlayer(root, { winner, reason, state, scores, onExit, onNextRound }) {
	const isTie = reason === 'tie';
	const titleText = isTie ? 'EMPATE' : 'VICTORIA';
	const nameText = isTie ? '' : (winner === 'p1' ? (state.players?.p1Name || 'Jugador') : (state.players?.p2Name || 'Jugador 2'));
	const imagePath = './assets/images/Trophy.png';

	const modal = createWinModal({
		winnerTitle: titleText,
		winnerName: nameText,
		variant: isTie ? 'tie' : 'win',
		trophyImage: imagePath,
		scores,
		onExit,
		onNextRound,
	});
	modal.open(root);
}

export default { renderWinPlayer };
