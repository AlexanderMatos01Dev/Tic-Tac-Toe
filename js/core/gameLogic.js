// Lógica del tablero (turnos, ganador, empate, reinicio)

import { Storage } from './storage.js';
import { getRandomMove } from './cpuLogic.js';
import { checkWinner } from './gameRules.js';
import { createOrResumeGame, saveState } from './sessionManager.js';

function defaultState({ mode = 'pvp', players }) {
	return {
		mode,
		players: { p1Name: players.player1, p2Name: players.player2 },
		scoreboard: { p1Wins: 0, p2Wins: 0, ties: 0 },
		board: Array(9).fill(null),
		// roundIndex alterna marcas entre rondas para que nadie repita círculo seguidamente
		roundIndex: 0,
		marks: { p1: 'X', p2: 'O' },
		turnMark: 'X', // siempre empieza X
		finished: false,
		lastUpdated: Date.now(),
	};
}

function recomputeMarks(state) {
	const even = state.roundIndex % 2 === 0;
	state.marks = even ? { p1: 'X', p2: 'O' } : { p1: 'O', p2: 'X' };
	state.turnMark = 'X';
}

export function createGame({ mode = 'pvp', players, onUpdate, onFinish } = {}) {
	// Elegir o crear partida según participantes (no finalizada)
	const { state: existing } = createOrResumeGame({ mode, players });
	let state = existing || defaultState({ mode, players });
	Storage.save(state);

	// Si cambian nombres explícitamente, respetarlos
	if (players?.player1) state.players.p1Name = players.player1;
	if (players?.player2) state.players.p2Name = players.player2;

	function isCpuTurn() {
		if (state.mode !== 'pvc') return false;
		// En pvc, p2 es CPU
		const cpuMark = state.marks.p2;
		return state.turnMark === cpuMark;
	}

	function applyMove(index) {
		if (state.finished) return;
		if (state.board[index] != null) return;

		state.board[index] = state.turnMark;

			// ¿alguien ganó o hubo empate?
			const res = checkWinner(state.board);
		if (res) {
			// No marcar la sesión como finalizada a nivel de almacenamiento.
			// Solo bloquear interacciones en UI con esta bandera en memoria si se requiere.
			state.finished = true;
			if (res.tie) {
				state.scoreboard.ties += 1;
				// Persistir con finished=false para permitir reanudación de la sesión
				const id = Storage.getCurrentGameId?.() || null;
				if (id) Storage.saveGame(id, { ...state, finished: false, lastUpdated: Date.now() });
				onUpdate?.(cloneState());
				// Pequeño feedback antes de anunciar
				setTimeout(() => {
					onFinish?.({ winner: null, reason: 'tie', state: cloneState() });
				}, 600);
				return;
			}
			// Ganador por marca
			const winnerMark = res.winnerMark;
			const winnerIsP1 = state.marks.p1 === winnerMark;
			if (winnerIsP1) state.scoreboard.p1Wins += 1; else state.scoreboard.p2Wins += 1;
			// Persistir con finished=false para permitir reanudación de la sesión
			const id = Storage.getCurrentGameId?.() || null;
			if (id) Storage.saveGame(id, { ...state, finished: false, lastUpdated: Date.now() });
			onUpdate?.(cloneState());
			setTimeout(() => {
				onFinish?.({
					winner: winnerIsP1 ? 'p1' : 'p2',
					reason: 'win',
					line: res.line,
					state: cloneState(),
				});
			}, 600);
			return;
		}

		// Cambiar turno
		state.turnMark = state.turnMark === 'X' ? 'O' : 'X';
		Storage.save(state);
		onUpdate?.(cloneState());

		// Turno del CPU
		if (isCpuTurn()) {
			setTimeout(() => {
				const move = getRandomMove(state.board);
				if (move >= 0) applyMove(move);
			}, 450);
		}
	}

	function startNextRound() {
		state.roundIndex += 1;
		state.board = Array(9).fill(null);
		state.finished = false;
		recomputeMarks(state);
		Storage.save(state);
		onUpdate?.(cloneState());

		if (isCpuTurn()) {
			setTimeout(() => {
				const move = getRandomMove(state.board);
				if (move >= 0) applyMove(move);
			}, 450);
		}
	}

	function resetPositions() {
		// Reinicia SOLO las posiciones de la ronda actual sin tocar historial, nombres ni roundIndex
		state.board = Array(9).fill(null);
		state.finished = false;
		// Siempre inicia 'X' en cada ronda; no alteramos asignación de marcas (state.marks)
		state.turnMark = 'X';
		Storage.save(state);
		onUpdate?.(cloneState());

		if (isCpuTurn()) {
			setTimeout(() => {
				const move = getRandomMove(state.board);
				if (move >= 0) applyMove(move);
			}, 450);
		}
	}

	function resetAll() {
		const fresh = defaultState({ mode: state.mode, players: state.players });
		state = fresh;
		Storage.save(state);
		onUpdate?.(cloneState());
	}

	function cloneState() {
		return JSON.parse(JSON.stringify(state));
	}

	// Al crear el juego, si le toca al CPU iniciar, jugar automáticamente
	setTimeout(() => {
		onUpdate?.(cloneState());
		if (isCpuTurn()) {
			const move = getRandomMove(state.board);
			if (move >= 0) applyMove(move);
		}
	}, 0);

	return {
		getState: () => cloneState(),
		playCell: (index) => applyMove(index),
		startNextRound,
		resetAll,
		resetPositions,
	};
}

export default { createGame };
