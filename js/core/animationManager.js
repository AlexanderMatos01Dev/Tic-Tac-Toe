// Animaciones genéricas (efectos de click, entrada, victoria)

/**
 * Dispara una animación de cambio de signo en el header.
 * Agrega la clase 'mark-swap' al contenedor y la remueve al finalizar.
 * @param {HTMLElement} container
 */
export function playMarkerSwap(container) {
	if (!container) return;
	// Reiniciar si ya tiene la clase
	container.classList.remove('mark-swap');
	// Forzar reflow para reiniciar la animación
	// eslint-disable-next-line no-unused-expressions
	container.offsetWidth;
	container.classList.add('mark-swap');
	const cleanup = () => {
		container.classList.remove('mark-swap');
		container.removeEventListener('animationend', cleanup);
	};
	container.addEventListener('animationend', cleanup);
}

export default { playMarkerSwap };
