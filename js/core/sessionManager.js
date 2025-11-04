// Manejo de sesiones/partidas: crear o reanudar, ids, finalización

import { Storage } from './storage.js';
import { createGameId, areSameParticipants } from './utils.js';
import { checkWinner } from './gameRules.js';

// Limpiar sesiones viejas (más de 7 días)
function cleanOldSessions() {
  const root = Storage.getRoot();
  const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  const entries = Object.entries(root.games || {});
  
  let cleaned = false;
  for (const [id, state] of entries) {
    // Eliminar sesiones viejas o sesiones finalizadas sin jugadas
    const isOld = (state.lastUpdated || 0) < sevenDaysAgo;
    const isEmptyFinished = state.finished && state.board && state.board.every(cell => cell === null);
    
    if (isOld || isEmptyFinished) {
      delete root.games[id];
      cleaned = true;
    }
  }
  
  if (cleaned) {
    Storage.setRoot(root);
  }
}

export function createOrResumeGame({ mode, players }) {
  // Limpiar sesiones viejas primero
  cleanOldSessions();
  
  const root = Storage.getRoot();
  const p = { mode, p1Name: players.player1, p2Name: players.player2 };

  // Buscar partida no finalizada con los mismos participantes
  const entries = Object.entries(root.games || {});

  // Descartar partidas terminadas o con tablero ya decidido (por seguridad)
  const candidates = entries
    .filter(([_, state]) => {
      if (!state) return false;
      const decided = !!checkWinner(state.board);
      return !state.finished && !decided;
    })
    // Preferir la más reciente
    .sort((a, b) => (b[1].lastUpdated || 0) - (a[1].lastUpdated || 0));

  // Solo reanudar si hay una partida activa (con jugadas hechas) de los mismos participantes
  for (const [id, state] of candidates) {
    if (areSameParticipants({ mode: state.mode, p1Name: state.players.p1Name, p2Name: state.players.p2Name }, p)) {
      // Solo reanudar si hay jugadas hechas (al menos una celda ocupada)
      const hasMovesPlayed = state.board && state.board.some(cell => cell !== null);
      if (hasMovesPlayed) {
        Storage.setCurrentGameId(id);
        console.log(`Reanudando sesión: ${id}`);
        return { id, state };
      }
    }
  }

  // No hay partida activa → crear una nueva con ID único
  const id = createGameId(p);
  const state = null; // será creado por gameLogic
  Storage.setCurrentGameId(id);
  console.log(`Nueva sesión creada: ${id}`);
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

// Función de utilidad para debugging - ver todas las sesiones
export function listAllSessions() {
  const root = Storage.getRoot();
  const entries = Object.entries(root.games || {});
  
  console.log('=== SESIONES GUARDADAS ===');
  console.log(`Total: ${entries.length} sesiones`);
  console.log(`Sesión actual: ${root.currentGameId || 'ninguna'}`);
  console.log('');
  
  entries.forEach(([id, state]) => {
    const hasMovesPlayed = state.board && state.board.some(cell => cell !== null);
    const movesCount = state.board ? state.board.filter(cell => cell !== null).length : 0;
    const status = state.finished ? '✓ Finalizada' : hasMovesPlayed ? '▶ En progreso' : '○ Sin jugadas';
    const date = new Date(state.lastUpdated || 0).toLocaleString();
    
    console.log(`${status} | ${id}`);
    console.log(`  Modo: ${state.mode} | ${state.players.p1Name} vs ${state.players.p2Name}`);
    console.log(`  Jugadas: ${movesCount}/9 | Score: ${state.scoreboard.p1Wins}-${state.scoreboard.p2Wins}-${state.scoreboard.ties}`);
    console.log(`  Última actualización: ${date}`);
    console.log('');
  });
  
  return entries;
}

// Función para limpiar todas las sesiones (útil para testing)
export function clearAllSessions() {
  Storage.clear();
  console.log('Todas las sesiones han sido eliminadas');
}

export default { createOrResumeGame, markFinished, saveState, listAllSessions, clearAllSessions };
