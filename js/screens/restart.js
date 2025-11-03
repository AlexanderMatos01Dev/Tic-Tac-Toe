// Pantalla/modal de confirmación de reinicio centralizada
import { createRestartModal } from '../components/modal.js';

// Abre el modal de reinicio y delega callbacks
// Contrato:
// - root: contenedor donde se adjunta el overlay
// - onConfirm: ejecutar resetPositions o lógica equivalente
// - onCancel: sólo cierra
export function openRestart(root = document.getElementById('app'), { onConfirm = () => {}, onCancel = () => {} } = {}) {
	const modal = createRestartModal({ onConfirm, onCancel });
	modal.open(root);
	return modal;
}

export default { openRestart };
