// Punto de entrada, inicializa la app y controla navegación entre pantallas
import { renderHome } from './screens/home.js';

// Inicialización simple — por ahora solo renderizamos la pantalla de selección
function init() {
	// Garantizar que exista el contenedor
	const app = document.getElementById('app');
	if (!app) {
		console.error('No se encontró el contenedor #app');
		return;
	}

	renderHome(app);
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
	init();
} else {
	window.addEventListener('DOMContentLoaded', init);
}
