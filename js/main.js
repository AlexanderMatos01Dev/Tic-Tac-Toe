// Punto de entrada, inicializa la app y controla navegación entre pantallas
import { renderHome } from './screens/home.js';
import { listAllSessions, clearAllSessions } from './core/sessionManager.js';

// Inicialización simple — por ahora solo renderizamos la pantalla de selección
function init() {
	// Garantizar que exista el contenedor
	const app = document.getElementById('app');
	if (!app) {
		console.error('No se encontró el contenedor #app');
		return;
	}

	renderHome(app);
	
	// Exponer funciones de debug en la consola
	window.TTT = {
		listSessions: listAllSessions,
		clearSessions: clearAllSessions
	};
	
	console.log('🎮 Tic Tac Toe cargado. Usa TTT.listSessions() para ver sesiones guardadas.');
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
	init();
} else {
	window.addEventListener('DOMContentLoaded', init);
}
