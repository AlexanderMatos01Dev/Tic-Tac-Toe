// Lógica del tablero (turnos, ganador, empate, reinicio)

import { Storage } from './storage.js';
import { getRandomMove } from './cpuLogic.js';
import { checkWinner } from './gameRules.js';
import { createOrResumeGame, saveState } from './sessionManager.js';

function defaultState({ mode = 'pvp', players }) {
	// Aleatorizar quién empieza (X u O)
	const randomStart = Math.random() < 0.5 ? 'X' : 'O';
	
	return {
		mode,
		players: { p1Name: players.player1, p2Name: players.player2 },
		scoreboard: { p1Wins: 0, p2Wins: 0, ties: 0 },
		board: Array(9).fill(null),
		// roundIndex alterna marcas entre rondas para que nadie repita círculo seguidamente
		roundIndex: 0,
		marks: { p1: 'X', p2: 'O' },
		turnMark: randomStart, // Empieza aleatoriamente X o O
		finished: false,
		lastUpdated: Date.now(),
	};
}

function recomputeMarks(state) {
	const even = state.roundIndex % 2 === 0;
	state.marks = even ? { p1: 'X', p2: 'O' } : { p1: 'O', p2: 'X' };
	state.turnMark = 'X';
}

export function createGame({ mode = 'pvp', players, onUpdate, onFinish, onGameReady } = {}) {
	// Pequeño retardo antes de mostrar la pantalla/modal de resultado
	const RESULT_REVEAL_DELAY = 800; // ms
	// Delay para el CPU (más realista)
	const CPU_MOVE_DELAY = 800; // ms
	
	// Elegir o crear partida según participantes (no finalizada)
	const { state: existing, id: gameId } = createOrResumeGame({ mode, players });
	let state = existing || defaultState({ mode, players });
	
	// Guardar estado inicial con el ID correcto
	const currentId = Storage.getCurrentGameId();
	if (currentId) {
		Storage.saveGame(currentId, { ...state, lastUpdated: Date.now() });
	}

	// Si cambian nombres explícitamente, respetarlos
	if (players?.player1) state.players.p1Name = players.player1;
	if (players?.player2) state.players.p2Name = players.player2;

	// Timer único para el CPU
	let cpuTimer = null;
	let gameIsReady = false; // El juego NO está listo hasta que termine el countdown

	function clearCpuTimer() {
		if (cpuTimer) { clearTimeout(cpuTimer); cpuTimer = null; }
	}

	// NUEVA LÓGICA: El CPU solo juega cuando se le invoca explícitamente
	function tryPlayCpuTurn() {
		clearCpuTimer();
		
		// Verificaciones: debe estar listo, ser turno del CPU, y no terminado
		if (!gameIsReady || !isCpuTurn() || state.finished) return;

		// Aplicar delay humano del CPU antes de jugar
		cpuTimer = setTimeout(() => {
			if (!isCpuTurn() || state.finished) return;
			const move = getRandomMove(state.board);
			if (move >= 0) applyMove(move);
		}, CPU_MOVE_DELAY);
	}

	function isCpuTurn() {
		if (state.mode !== 'pvc') return false;
		// En pvc, p2 es CPU
		const cpuMark = state.marks.p2;
		return state.turnMark === cpuMark;
	}

	function applyMove(index) {
		if (!gameIsReady || state.finished) return;
		if (state.board[index] != null) return;

		state.board[index] = state.turnMark;

		// ¿alguien ganó o hubo empate?
		const res = checkWinner(state.board);
		if (res) {
			
			state.finished = true;
			// Cancelar cualquier jugada pendiente del CPU
			clearCpuTimer();
			if (res.tie) {
				state.scoreboard.ties += 1;
				// Persistir como finalizada para que NO se reanude
				const id = Storage.getCurrentGameId?.() || null;
				if (id) Storage.saveGame(id, { ...state, finished: true, lastUpdated: Date.now() });
				onUpdate?.(cloneState());
				// Pequeño feedback antes de anunciar
				setTimeout(() => {
					onFinish?.({ winner: null, reason: 'tie', state: cloneState() });
				}, RESULT_REVEAL_DELAY);
				return;
			}
			// Ganador por marca
			const winnerMark = res.winnerMark;
			const winnerIsP1 = state.marks.p1 === winnerMark;
			if (winnerIsP1) state.scoreboard.p1Wins += 1; else state.scoreboard.p2Wins += 1;
			// Persistir como finalizada para que NO se reanude
			const id = Storage.getCurrentGameId?.() || null;
			if (id) Storage.saveGame(id, { ...state, finished: true, lastUpdated: Date.now() });
			onUpdate?.(cloneState());
			setTimeout(() => {
				onFinish?.({
					winner: winnerIsP1 ? 'p1' : 'p2',
					reason: 'win',
					line: res.line,
					state: cloneState(),
				});
			}, RESULT_REVEAL_DELAY);
			return;
		}

		// Cambiar turno y notificar
		state.turnMark = state.turnMark === 'X' ? 'O' : 'X';
		// Guardar estado actualizado
		const id = Storage.getCurrentGameId?.() || null;
		if (id) Storage.saveGame(id, { ...state, lastUpdated: Date.now() });
		onUpdate?.(cloneState());

		// EVENTO: después de cambiar turno, intentar que juegue el CPU
		tryPlayCpuTurn();
	}

	function startNextRound() {
		state.roundIndex += 1;
		state.board = Array(9).fill(null);
		state.finished = false;
		gameIsReady = false; // Bloquear hasta que termine el countdown
		recomputeMarks(state);
		// Guardar estado actualizado
		const id = Storage.getCurrentGameId?.() || null;
		if (id) Storage.saveGame(id, { ...state, lastUpdated: Date.now() });
		onUpdate?.(cloneState());
		// NO programar CPU aquí - esperar evento de "juego listo"
	}

	function resetPositions() {
		// Reinicia SOLO las posiciones de la ronda actual sin tocar historial, nombres ni roundIndex
		state.board = Array(9).fill(null);
		state.finished = false;
		gameIsReady = false; // Bloquear hasta que termine el countdown
		// Siempre inicia 'X' en cada ronda; no alteramos asignación de marcas (state.marks)
		state.turnMark = 'X';
		// Guardar estado actualizado
		const id = Storage.getCurrentGameId?.() || null;
		if (id) Storage.saveGame(id, { ...state, lastUpdated: Date.now() });
		onUpdate?.(cloneState());
		// NO programar CPU aquí - esperar evento de "juego listo"
	}

	function resetAll() {
		const fresh = defaultState({ mode: state.mode, players: state.players });
		state = fresh;
		// Guardar estado actualizado
		const id = Storage.getCurrentGameId?.() || null;
		if (id) Storage.saveGame(id, { ...state, lastUpdated: Date.now() });
		onUpdate?.(cloneState());
	}

	function cloneState() {
		return JSON.parse(JSON.stringify(state));
	}

	// Función para marcar el juego como listo (llamada desde el exterior después del countdown)
	function markGameReady() {
		gameIsReady = true;
		// EVENTO: El juego está listo, intentar que juegue el CPU si le toca
		tryPlayCpuTurn();
	}

	// Inicialización: notificar estado inicial pero NO permitir jugar hasta markGameReady()
	setTimeout(() => {
		onUpdate?.(cloneState());
		// Notificar que el juego está creado (para iniciar countdown)
		onGameReady?.();
	}, 0);

	return {
		getState: () => cloneState(),
		playCell: (index) => applyMove(index),
		startNextRound,
		resetAll,
		resetPositions,
		markGameReady, // NUEVA función para indicar que el countdown terminó
	};
}

export default { createGame };
