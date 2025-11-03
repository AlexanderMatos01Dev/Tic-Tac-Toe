// Manejo de sesiones/partidas: crear o reanudar, ids, finalización

import { Storage } from './storage.js';
import { createGameId, areSameParticipants } from './utils.js';

export function createOrResumeGame({ mode, players }) {
  const root = Storage.getRoot();
  const p = { mode, p1Name: players.player1, p2Name: players.player2 };

  // Buscar partida no finalizada con los mismos participantes
  const entries = Object.entries(root.games || {});
  for (const [id, state] of entries) {
    if (areSameParticipants({ mode: state.mode, p1Name: state.players.p1Name, p2Name: state.players.p2Name }, p) && !state.finished) {
      Storage.setCurrentGameId(id);
      return { id, state };
    }
  }

  // No hay partida activa → crear una nueva
  const id = createGameId(p);
  const state = null; // será creado por gameLogic
  Storage.setCurrentGameId(id);
  return { id, state };
}

export function markFinished(gameState) {
  const id = Storage.getCurrentGameId();
  if (!id) return;
  const state = { ...gameState, finished: true, lastUpdated: Date.now() };
  Storage.saveGame(id, state);
}

export function saveState(gameState) {
  const id = Storage.getCurrentGameId();
  if (!id) return;
  const state = { ...gameState, lastUpdated: Date.now() };
  Storage.saveGame(id, state);
}

export default { createOrResumeGame, markFinished, saveState };
