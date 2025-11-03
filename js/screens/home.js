// Pantalla Home: delega la lógica de inicio hacia la selección de modo de juego
import { renderGameModeSelection } from './gameModSelection.js';

// Punto único para arrancar la app desde Home
// Contrato: renderHome(root) limpia y monta la pantalla inicial
export function renderHome(root = document.getElementById('app')) {
	return renderGameModeSelection(root);
}

export default { renderHome };
