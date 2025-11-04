// Session manager - handles creating, resuming, and managing game sessions
import Storage from './storage.js';
import { createGameId } from './utils.js';

const SESSION_TIMEOUT = 7 * 24 * 60 * 60 * 1000; // 7 days

// Clean up old sessions
function cleanupOldSessions() {
  const sessions = Storage.sessions.getAll();
  const now = Date.now();
  let cleaned = false;

  for (const [id, session] of Object.entries(sessions)) {
    if (session.lastUpdated && (now - session.lastUpdated) > SESSION_TIMEOUT) {
      Storage.sessions.delete(id);
      cleaned = true;
    }
  }

  if (cleaned) {
    console.log('Cleaned up old sessions');
  }
}

// Create or resume a game session
export function createOrResumeGame({ mode, players }) {
  cleanupOldSessions();

  const sessions = Storage.sessions.getAll();
  const p1 = players.player1 || 'Player 1';
  const p2 = players.player2 || 'Player 2';

  // Look for an active session with the same players and mode
  for (const [id, session] of Object.entries(sessions)) {
    if (session.mode === mode &&
        session.players?.p1Name === p1 &&
        session.players?.p2Name === p2 &&
        !session.finished &&
        session.board &&
        session.board.some(cell => cell !== null)) { // Has moves played
      console.log(`Resuming session: ${id}`);
      setCurrentSessionId(id); // Set as current session
      return { id, state: session };
    }
  }

  // Create new session
  const id = createGameId({ mode, p1Name: p1, p2Name: p2 });
  setCurrentSessionId(id); // Set as current session
  console.log(`Created new session: ${id}`);
  return { id, state: null };
}

// Save current game state
export function saveState(gameId, state) {
  if (!gameId) return;
  Storage.sessions.save(gameId, state);
}

// Mark a session as finished
export function markFinished(gameId, finalState) {
  if (!gameId) return;
  const state = { ...finalState, finished: true, lastUpdated: Date.now() };
  Storage.sessions.save(gameId, state);
  // Clear current session ID since the game is finished
  setCurrentSessionId(null);
}

// Get current session ID (if any)
export function getCurrentSessionId() {
  // For simplicity, we'll track this in a separate key
  try {
    return localStorage.getItem('game:currentSession') || null;
  } catch {
    return null;
  }
}

// Set current session ID
export function setCurrentSessionId(id) {
  try {
    if (id) {
      localStorage.setItem('game:currentSession', id);
    } else {
      localStorage.removeItem('game:currentSession');
    }
  } catch (e) {
    console.warn('Failed to set current session ID', e);
  }
}

// List all sessions (for debugging)
export function listAllSessions() {
  const sessions = Storage.sessions.getAll();
  console.log('=== GAME SESSIONS ===');
  console.log(`Total: ${Object.keys(sessions).length}`);
  console.log(`Current: ${getCurrentSessionId() || 'none'}`);

  for (const [id, session] of Object.entries(sessions)) {
    const status = session.finished ? 'Finished' : 'Active';
    const moves = session.board ? session.board.filter(cell => cell !== null).length : 0;
    const date = new Date(session.lastUpdated || 0).toLocaleString();
    console.log(`${status} | ${id} | Moves: ${moves} | ${date}`);
  }

  return sessions;
}

// Clear all sessions
export function clearAllSessions() {
  Storage.sessions.clear();
  setCurrentSessionId(null);
  console.log('All sessions cleared');
}

export default { createOrResumeGame, saveState, markFinished, getCurrentSessionId, setCurrentSessionId, listAllSessions, clearAllSessions };
