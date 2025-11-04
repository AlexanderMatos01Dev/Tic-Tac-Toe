// Simple storage API for games - handles sessions and pair summaries
// Uses localStorage with JSON serialization

const SESSIONS_KEY = 'game:sessions';
const PAIRS_KEY = 'game:pairs';

// Utility functions
function loadJSON(key, fallback = {}) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn(`Storage: failed to load ${key}`, e);
    return fallback;
  }
}

function saveJSON(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Storage: failed to save ${key}`, e);
  }
}

// Sessions API - for saving/loading game states
const Sessions = {
  // Get all sessions
  getAll() {
    return loadJSON(SESSIONS_KEY, {});
  },

  // Save a session
  save(id, data) {
    const sessions = this.getAll();
    sessions[id] = { ...data, lastUpdated: Date.now() };
    saveJSON(SESSIONS_KEY, sessions);
  },

  // Load a session
  load(id) {
    const sessions = this.getAll();
    return sessions[id] || null;
  },

  // Delete a session
  delete(id) {
    const sessions = this.getAll();
    delete sessions[id];
    saveJSON(SESSIONS_KEY, sessions);
  },

  // Clear all sessions
  clear() {
    saveJSON(SESSIONS_KEY, {});
  },

  // List all session IDs
  list() {
    return Object.keys(this.getAll());
  }
};

// Pairs API - for historical stats between player pairs
const Pairs = {
  // Get all pair data
  getAll() {
    return loadJSON(PAIRS_KEY, {});
  },

  // Get data for a specific pair (order doesn't matter)
  get(p1, p2) {
    const pairs = this.getAll();
    const key = this.makeKey(p1, p2);
    return pairs[key] || null;
  },

  // Save/update pair data
  save(p1, p2, data) {
    const pairs = this.getAll();
    const key = this.makeKey(p1, p2);
    pairs[key] = { ...data, lastUpdated: Date.now() };
    saveJSON(PAIRS_KEY, pairs);
  },

  // Update pair stats (increment wins/ties)
  updateStats(p1, p2, winner, isTie = false) {
    const existing = this.get(p1, p2) || { p1, p2, wins: { [p1]: 0, [p2]: 0 }, ties: 0, games: 0 };
    existing.games += 1;
    if (isTie) {
      existing.ties += 1;
    } else if (winner) {
      existing.wins[winner] = (existing.wins[winner] || 0) + 1;
    }
    this.save(p1, p2, existing);
    return existing;
  },

  // Make a consistent key for pairs (order-independent)
  makeKey(p1, p2) {
    const sorted = [p1 || '', p2 || ''].sort();
    return `${sorted[0]}::${sorted[1]}`;
  },

  // Clear all pair data
  clear() {
    saveJSON(PAIRS_KEY, {});
  }
};

// Main Storage API
const Storage = {
  sessions: Sessions,
  pairs: Pairs,

  // Clear everything
  clearAll() {
    this.sessions.clear();
    this.pairs.clear();
  }
};

export default Storage;
