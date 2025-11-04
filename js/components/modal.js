// Modales: overlay + contenedor dibujado con imagen de fondo y trofeo

export function createWinModal({
	winnerTitle = 'VICTORIA',
	winnerName = '',
	scores = { p1Label: 'JE', p2Label: 'CPU', p1Wins: 0, p2Wins: 0, ties: 0 },
		variant = 'win',
	trophyImage = './assets/images/Trophy.png',
	onExit = () => {},
	onNextRound = () => {},
} = {}) {
	const overlay = document.createElement('div');
	overlay.className = 'modal-overlay';

	const modal = document.createElement('div');
	modal.className = 'win-modal';

	// Trophy centrado con wrapper para glow detrás
		const trophyWrap = document.createElement('div');
		trophyWrap.className = 'win-modal__trophy';
		const trophyImg = document.createElement('div');
		trophyImg.className = 'win-modal__trophy-img';
		// Permite cambiar la imagen central según el resultado
		if (trophyImage) {
			trophyImg.style.backgroundImage = `url('${trophyImage}')`;
			trophyImg.style.backgroundRepeat = 'no-repeat';
			trophyImg.style.backgroundPosition = 'center top';
			trophyImg.style.backgroundSize = 'contain';
		}
		trophyWrap.appendChild(trophyImg);
	modal.appendChild(trophyWrap);

	// Títulos
	const title = document.createElement('div');
	title.className = 'win-modal__title';
	title.textContent = winnerTitle;
	const subtitle = document.createElement('div');
	subtitle.className = 'win-modal__subtitle';
	subtitle.textContent = winnerName;
	modal.appendChild(title);
	modal.appendChild(subtitle);

		// Contenedor de puntuación (ganadas y empates)
		const scoresWrap = document.createElement('div');
		scoresWrap.className = 'win-modal__scores';

		const block1 = summaryItem(scores.p1Label, `${scores.p1Wins} GANADAS`);
		const block2 = summaryItem(scores.p2Label, `${scores.p2Wins} GANADAS`);
		const block3 = summaryItemWithIcon(' ', `${scores.ties} EMPATES`);
		scoresWrap.appendChild(block1);
		scoresWrap.appendChild(block2);
		scoresWrap.appendChild(block3);
		modal.appendChild(scoresWrap);

	// Botones
		const actions = document.createElement('div');
		actions.className = 'win-modal__actions';
	const exitBtn = document.createElement('button');
	exitBtn.className = 'modal-btn orange';
	exitBtn.textContent = 'SALIR';
	exitBtn.addEventListener('click', () => { close(); onExit(); });
	const nextBtn = document.createElement('button');
	nextBtn.className = 'modal-btn blue';
	nextBtn.textContent = 'PRÓXIMO ROUND';
	nextBtn.addEventListener('click', () => { close(); onNextRound(); });
	actions.appendChild(exitBtn);
	actions.appendChild(nextBtn);
	modal.appendChild(actions);

	overlay.appendChild(modal);

	function open(root = document.body) {
		root.appendChild(overlay);
		requestAnimationFrame(() => overlay.classList.add('open'));
	}

	function close() {
		overlay.classList.remove('open');
		setTimeout(() => overlay.remove(), 200);
	}

		function updateScores(newScores) {
			const [b1, b2, b3] = scoresWrap.querySelectorAll('.summary-item');
		if (b1) b1.querySelector('.child').textContent = `${newScores.p1Wins} GANADAS`;
		if (b2) b2.querySelector('.child').textContent = `${newScores.p2Wins} GANADAS`;
		if (b3) b3.querySelector('.child').textContent = `${newScores.ties} EMPATES`;
	}

		// Añade una clase de variante al modal para futuros estilos si hiciera falta
		if (variant) modal.classList.add(`win-modal--${variant}`);

		return { element: overlay, open, close, updateScores };
}

function summaryItem(parent, child) {
	const wrap = document.createElement('div');
	wrap.className = 'summary-item';
	const p = document.createElement('div');
	p.className = 'parent';
	p.textContent = parent;
	const c = document.createElement('div');
	c.className = 'child';
	c.textContent = child;
	wrap.appendChild(p);
	wrap.appendChild(c);
	return wrap;
}

function summaryItemWithIcon(parent, child) {
	const wrap = summaryItem(parent, child);
	const iconWrap = document.createElement('div');
	iconWrap.className = 'summary-icon';
	iconWrap.innerHTML = `
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 54.166 42.243" aria-hidden="true">
			<path d="M.32,27.7a6.995,6.995,0,0,0,13.872,0ZM38.113,41.786a1.083,1.083,0,0,1-1.081,1.087H16.822a1.081,1.081,0,1,1,0-2.162H37.031A1.078,1.078,0,0,1,38.113,41.786Zm-22.257,1.64H38v3.128H15.856ZM39.974,27.7a6.991,6.991,0,0,0,13.867,0ZM53.46,25.527,47.78,17.7h3.037a1.348,1.348,0,0,0,0-2.7H34.732a7.966,7.966,0,0,0-6.1-5.126V5.66a1.345,1.345,0,0,0-1.349-1.35l-.126.014-.126-.014a1.343,1.343,0,0,0-1.347,1.35V9.88a7.96,7.96,0,0,0-6.1,5.126H3.493a1.348,1.348,0,0,0,0,2.7h2.9L.71,25.525H0V26.97H14.514V25.525H13.8L8.123,17.7H21.305a5.71,5.71,0,0,1,.079-.893,1.273,1.273,0,0,0,.078-.415,5.759,5.759,0,0,1,4.219-4.261V26.973h-.056a16.385,16.385,0,0,1-6.71,13.184H35.4a16.4,16.4,0,0,1-6.715-13.184H28.63V12.135A5.758,5.758,0,0,1,32.848,16.4a1.369,1.369,0,0,0,.081.415A6.005,6.005,0,0,1,33,17.7H46.045l-5.681,7.824h-.708v1.445h14.51V25.527Zm-46.782,0H2.145l4.534-6.245v6.245Zm1.16,0V19.282l4.534,6.245H7.839Zm38.492,0H41.8l4.536-6.245Zm1.155,0V19.282l4.539,6.245ZM8.6,13.126a1.346,1.346,0,1,1-1.343-1.35A1.347,1.347,0,0,1,8.6,13.126Zm39.653-.071a1.347,1.347,0,1,1-.657-1.211A1.339,1.339,0,0,1,48.256,13.054Z" transform="translate(0 -4.311)" fill="#fff"/>
		</svg>`;
	wrap.prepend(iconWrap);
	return wrap;
}

export default { createWinModal };

// Modal de confirmación para reiniciar partida
export function createRestartModal({
	message = '¿Seguro que desea\nreiniciar la partida?',
	onCancel = () => {},
	onConfirm = () => {},
} = {}) {
	const overlay = document.createElement('div');
	overlay.className = 'modal-overlay';

	const modal = document.createElement('div');
	modal.className = 'restart-modal';

	const title = document.createElement('div');
	title.className = 'restart-modal__title';
	// Forzar salto de línea entre frases como en el diseño
	title.innerHTML = '¿Seguro que desea<br/>reiniciar la partida?';
	modal.appendChild(title);

	const actions = document.createElement('div');
	actions.className = 'restart-modal__actions';
	const cancelBtn = document.createElement('button');
	cancelBtn.className = 'modal-btn orange';
	cancelBtn.textContent = 'CANCELAR';
	cancelBtn.addEventListener('click', () => { close(); onCancel(); });
	const confirmBtn = document.createElement('button');
	confirmBtn.className = 'modal-btn blue';
	confirmBtn.textContent = 'REINICIAR PARTIDA';
	confirmBtn.addEventListener('click', () => { close(); onConfirm(); });
	actions.appendChild(cancelBtn);
	actions.appendChild(confirmBtn);
	modal.appendChild(actions);

	overlay.appendChild(modal);

	function open(root = document.body) {
		root.appendChild(overlay);
		requestAnimationFrame(() => overlay.classList.add('open'));
	}

	function close() {
		overlay.classList.remove('open');
		setTimeout(() => overlay.remove(), 200);
	}

	return { element: overlay, open, close };
}
