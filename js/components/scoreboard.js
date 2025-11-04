// Componente del marcador (jugadores y puntuaciones)

import { Storage } from '../core/storage.js';

/**
 * Crea el componente de marcador con 3 columnas: P1, P2 y Empates.
 * Devuelve { element, update } donde update(state) refresca los valores.
 * @param {{ p1Label: string, p2Label: string, initial?: {p1Wins:number,p2Wins:number,ties:number} }} opts
 */
export function createScoreboard({ p1Label = '', p2Label = '', initial } = {}) {
	const root = document.createElement('div');
	root.className = 'game-scoreboard';

	// Helper para crear cada item del marcador
	function createItem({ header, subtext, withIcon = false }) {
		const item = document.createElement('div');
		item.className = 'score-item';

		if (withIcon) {
			const iconWrap = document.createElement('div');
			iconWrap.className = 'score-icon';
			iconWrap.innerHTML = `
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 54.166 42.243" aria-hidden="true">
					<path d="M.32,27.7a6.995,6.995,0,0,0,13.872,0ZM38.113,41.786a1.083,1.083,0,0,1-1.081,1.087H16.822a1.081,1.081,0,1,1,0-2.162H37.031A1.078,1.078,0,0,1,38.113,41.786Zm-22.257,1.64H38v3.128H15.856ZM39.974,27.7a6.991,6.991,0,0,0,13.867,0ZM53.46,25.527,47.78,17.7h3.037a1.348,1.348,0,0,0,0-2.7H34.732a7.966,7.966,0,0,0-6.1-5.126V5.66a1.345,1.345,0,0,0-1.349-1.35l-.126.014-.126-.014a1.343,1.343,0,0,0-1.347,1.35V9.88a7.96,7.96,0,0,0-6.1,5.126H3.493a1.348,1.348,0,0,0,0,2.7h2.9L.71,25.525H0V26.97H14.514V25.525H13.8L8.123,17.7H21.305a5.71,5.71,0,0,1,.079-.893,1.273,1.273,0,0,0,.078-.415,5.759,5.759,0,0,1,4.219-4.261V26.973h-.056a16.385,16.385,0,0,1-6.71,13.184H35.4a16.4,16.4,0,0,1-6.715-13.184H28.63V12.135A5.758,5.758,0,0,1,32.848,16.4a1.369,1.369,0,0,0,.081.415A6.005,6.005,0,0,1,33,17.7H46.045l-5.681,7.824h-.708v1.445h14.51V25.527Zm-46.782,0H2.145l4.534-6.245v6.245Zm1.16,0V19.282l4.534,6.245H7.839Zm38.492,0H41.8l4.536-6.245Zm1.155,0V19.282l4.539,6.245ZM8.6,13.126a1.346,1.346,0,1,1-1.343-1.35A1.347,1.347,0,0,1,8.6,13.126Zm39.653-.071a1.347,1.347,0,1,1-.657-1.211A1.339,1.339,0,0,1,48.256,13.054Z" transform="translate(0 -4.311)" fill="#fff"/>
				</svg>`;
			item.appendChild(iconWrap);
		} else {
			// Solo crear header si no hay icono
			const headerEl = document.createElement('div');
			headerEl.className = 'score-header';
			headerEl.textContent = header;
			item.appendChild(headerEl);
		}

		const subBlock = document.createElement('div');
		subBlock.className = 'score-subblock';
		const subEl = document.createElement('div');
		subEl.className = 'score-subtext';
		subEl.textContent = subtext;
		subBlock.appendChild(subEl);

		item.appendChild(subBlock);

		return { item, subEl };
	}

	// Items de marcador
	const p1 = createItem({ header: p1Label, subtext: '0 GANADAS' });
	const p2 = createItem({ header: p2Label, subtext: '0 GANADAS' });
	const ties = createItem({ header: '', subtext: '0 EMPATES', withIcon: true });

	root.appendChild(p1.item);
	root.appendChild(p2.item);
	root.appendChild(ties.item);

	// Inicializar con persistencia si hay un currentGameId guardado
	const persisted = Storage.load();
	const initialScores = initial || persisted?.scoreboard || { p1Wins: 0, p2Wins: 0, ties: 0 };
	p1.subEl.textContent = `${initialScores.p1Wins} GANADAS`;
	p2.subEl.textContent = `${initialScores.p2Wins} GANADAS`;
	ties.subEl.textContent = `${initialScores.ties} EMPATES`;

	function update(state) {
		const s = state?.scoreboard || { p1Wins: 0, p2Wins: 0, ties: 0 };
		p1.subEl.textContent = `${s.p1Wins} GANADAS`;
		p2.subEl.textContent = `${s.p2Wins} GANADAS`;
		ties.subEl.textContent = `${s.ties} EMPATES`;
	}

	return { element: root, update };
}

export default { createScoreboard };
