// Utilidades globales (manejo del DOM, helpers, formateo)

export function slugify(str) {
	return (str || '')
		.toString()
		.trim()
		.toLowerCase()
		.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)+/g, '');
}

// Variante que preserva mayúsculas/minúsculas pero limpia acentos y separadores
export function slugifyKeepCase(str) {
	return (str || '')
		.toString()
		.trim()
		.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
		.replace(/[^A-Za-z0-9]+/g, '-')
		.replace(/(^-|-$)+/g, '');
}

export function createGameId({ mode, p1Name, p2Name }) {
	// Preservar diferencias entre mayúsculas/minúsculas en los nombres
	const base = `${mode}-${slugifyKeepCase(p1Name)}-vs-${slugifyKeepCase(p2Name)}`;
	// Añadir timestamp para unicidad cuando se cree uno nuevo
	return `${base}-${Date.now()}`;
}

export function areSameParticipants(a, b) {
	// Comparar preservando mayúsculas/minúsculas
	const norm = (s) => slugifyKeepCase(s);
	return (
		a?.mode === b?.mode &&
		norm(a?.p1Name) === norm(b?.p1Name) &&
		norm(a?.p2Name) === norm(b?.p2Name)
	);
}

export default { slugify, slugifyKeepCase, createGameId, areSameParticipants };
