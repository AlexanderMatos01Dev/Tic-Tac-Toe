// Manejo completo del localStorage (guardar, cargar, historial)
import { slugifyKeepCase } from './utils.js';

const KEY = 'ttt-state-v2';
const VERSION = 2;
// Nuevo: almacenamiento de resúmenes por pareja de jugadores (orden invariante)
const SUMMARY_KEY = 'ttt-summaries-v1';

function _loadRoot() {
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return { version: VERSION, games: {}, currentGameId: null };
		const obj = JSON.parse(raw);
		if (!obj.games) obj.games = {};
		if (!obj.version) obj.version = VERSION;
		return obj;
	} catch (e) {
		console.warn('No se pudo cargar el estado raíz', e);
		return { version: VERSION, games: {}, currentGameId: null };
	}
}

function _saveRoot(root) {
	// Asegurar versión en cada guardado
	root.version = VERSION;
	const toJSON = JSON.stringify(root);
	try {
		localStorage.setItem(KEY, toJSON);
	} catch (e) {
		// Intento de recuperación si es un error de cuota: eliminar partidas más antiguas y reintentar
		const isQuota = (e && (e.name === 'QuotaExceededError' || e.code === 22));
		if (!isQuota) {
			console.warn('No se pudo guardar el estado raíz', e);
			return;
		}
		try {
			// Heurística: eliminar hasta 3 partidas más antiguas (priorizando finalizadas)
			const entries = Object.entries(root.games || {});
			entries.sort((a, b) => (a[1]?.lastUpdated || 0) - (b[1]?.lastUpdated || 0));
			let removed = 0;
			for (const [id, state] of entries) {
				if (removed >= 3) break;
				// Priorizar borrar finalizadas primero
				if (state?.finished) {
					delete root.games[id];
					removed++;
				}
			}
			// Si no hubo suficientes finalizadas, eliminar más antiguas activas
			if (removed < 3) {
				for (const [id] of entries) {
					if (!(id in root.games)) continue; // ya eliminada
					delete root.games[id];
					removed++;
					if (removed >= 3) break;
				}
			}
			localStorage.setItem(KEY, JSON.stringify(root));
			console.warn('Storage lleno: se eliminaron partidas antiguas para liberar espacio');
		} catch (e2) {
			console.warn('No se pudo guardar el estado raíz incluso tras limpieza', e2);
		}
	}
}

export const Storage = {
	// Compat: expone load/save del juego activo (si existe currentGameId)
	load() {
		const root = _loadRoot();
		const id = root.currentGameId;
		return id ? root.games[id] || null : null;
	},
	save(state) {
		const root = _loadRoot();
		const id = root.currentGameId;
		if (!id) {
			console.warn('save(): no hay currentGameId definido');
			return;
		}
		root.games[id] = state;
		root.currentGameId = id;
		_saveRoot(root);
	},
	clear() {
		try { localStorage.removeItem(KEY); } catch {}
	},

	// Nueva API por partida
	getRoot() { return _loadRoot(); },
	setRoot(root) { _saveRoot(root); },

	setCurrentGameId(id) {
		const root = _loadRoot();
		root.currentGameId = id;
		_saveRoot(root);
	},
	getCurrentGameId() { return _loadRoot().currentGameId || null; },

	loadGame(id) {
		if (!id) return null;
		const root = _loadRoot();
		return root.games[id] || null;
	},
	saveGame(id, state) {
		const root = _loadRoot();
		root.games[id] = state;
		_saveRoot(root);
	},
	clearGame(id) {
		const root = _loadRoot();
		delete root.games[id];
		if (root.currentGameId === id) root.currentGameId = null;
		_saveRoot(root);
	},
	listGames() {
		const root = _loadRoot();
		return Object.values(root.games || {});
	},

	// ====== RESÚMENES POR PAREJA ======
	// Carga el root de resúmenes
	_getSummariesRoot() {
		try {
			const raw = localStorage.getItem(SUMMARY_KEY);
			if (!raw) return { version: 1, pairs: {} };
			const obj = JSON.parse(raw);
			if (!obj.pairs) obj.pairs = {};
			if (!obj.version) obj.version = 1;
			return obj;
		} catch (e) {
			console.warn('No se pudo cargar el resumen', e);
			return { version: 1, pairs: {} };
		}
	},
	_setSummariesRoot(root) {
		root.version = 1;
		try {
			localStorage.setItem(SUMMARY_KEY, JSON.stringify(root));
		} catch (e) {
			console.warn('No se pudo guardar el resumen', e);
		}
	},
	// Genera una clave estable y sin importar el orden de los nombres
	getPairKey(nameA, nameB) {
		const a = slugifyKeepCase(nameA || '');
		const b = slugifyKeepCase(nameB || '');
		const sorted = [a, b].sort((x, y) => x.toLowerCase().localeCompare(y.toLowerCase()));
		return `pair:${sorted[0]}::${sorted[1]}`;
	},
	// Obtiene el resumen para dos jugadores
	getPairSummary(nameA, nameB) {
		const root = this._getSummariesRoot();
		const key = this.getPairKey(nameA, nameB);
		return root.pairs[key] || null;
	},
	// Actualiza el resumen tras finalizar una partida/round
	updatePairSummary({ mode, p1Name, p2Name, winnerName = null, reason = 'win' }) {
		const root = this._getSummariesRoot();
		const key = this.getPairKey(p1Name, p2Name);
		const now = Date.now();

		if (!root.pairs[key]) {
			const sortedOriginal = [p1Name, p2Name].sort((x, y) => x.toLowerCase().localeCompare(y.toLowerCase()));
			root.pairs[key] = {
				players: sortedOriginal,
				modes: {},
				totals: { games: 0, ties: 0, wins: {} },
				lastMatch: null,
				createdAt: now,
				updatedAt: now,
			};
		}
		const entry = root.pairs[key];
		entry.updatedAt = now;
		// Totales generales
		entry.totals.games += 1;
		if (reason === 'tie') {
			entry.totals.ties += 1;
		} else if (winnerName) {
			entry.totals.wins[winnerName] = (entry.totals.wins[winnerName] || 0) + 1;
		}
		// Por modo
		if (!entry.modes[mode]) {
			entry.modes[mode] = { games: 0, ties: 0, wins: {} };
		}
		entry.modes[mode].games += 1;
		if (reason === 'tie') {
			entry.modes[mode].ties += 1;
		} else if (winnerName) {
			entry.modes[mode].wins[winnerName] = (entry.modes[mode].wins[winnerName] || 0) + 1;
		}
		// Último resultado
		entry.lastMatch = { mode, winnerName: winnerName || null, reason, date: now };

		this._setSummariesRoot(root);
		return entry;
	},
	// Lista todas las parejas guardadas (para UI futura)
	listPairSummaries() {
		const root = this._getSummariesRoot();
		return root.pairs;
	}
};

export default Storage;
