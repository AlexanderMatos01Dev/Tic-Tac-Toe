// Manejo completo del localStorage (guardar, cargar, historial)

const KEY = 'ttt-state-v2';

function _loadRoot() {
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return { games: {}, currentGameId: null };
		const obj = JSON.parse(raw);
		if (!obj.games) obj.games = {};
		return obj;
	} catch (e) {
		console.warn('No se pudo cargar el estado raíz', e);
		return { games: {}, currentGameId: null };
	}
}

function _saveRoot(root) {
	try {
		localStorage.setItem(KEY, JSON.stringify(root));
	} catch (e) {
		console.warn('No se pudo guardar el estado raíz', e);
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
	}
};

export default Storage;
