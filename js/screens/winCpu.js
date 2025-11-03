// Pantalla de resultado contra CPU (ganar/perder)
import { createWinModal } from '../components/modal.js';

export function renderWinCpu(root, { winner, reason, state, scores, onExit, onNextRound }) {
	const isTie = reason === 'tie';
	let variant = 'win';
	let titleText = 'VICTORIA';
	let nameText = '';
	let imagePath = './assets/images/Trophy.png';

	if (isTie) {
		variant = 'tie';
		titleText = 'EMPATE';
		// En PVC mostrar el nombre del usuario en empate
		nameText = state.players?.p1Name || 'Jugador';
	} else if (winner === 'p2') {
		// Perdió el humano
		variant = 'loss';
		titleText = 'PERDISTE';
		nameText = state.players?.p1Name || 'Jugador';
		imagePath = './assets/images/LossImage.png';
	} else {
		// Ganó el humano
		titleText = 'VICTORIA';
		nameText = state.players?.p1Name || 'Jugador';
	}

	const modal = createWinModal({
		winnerTitle: titleText,
		winnerName: nameText,
		variant,
		trophyImage: imagePath,
		scores,
		onExit,
		onNextRound,
	});
	modal.open(root);
}

export default { renderWinCpu };
