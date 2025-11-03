const screens = {
  gameModeSelection: () => import('../screens/gameModSelection.js'),
  playerVsPlayer: () => import('../screens/playerVsPlayer.js'),
  game: () => import('../screens/game.js'),
  // future: playerVsCpu: () => import('../screens/playerVsCpu.js'),
};

export async function navigateTo(name, root = document.getElementById('app')) {
  if (!screens[name]) {
    console.warn(`No existe la pantalla: ${name}`);
    return null;
  }

  try {
    const mod = await screens[name]();
    // buscar función render estándar según naming convention
    const renderer = mod.renderPlayerVsPlayer 
      || mod.renderGameModeSelection 
      || mod.renderGame
      || mod.default 
      || null;
    if (typeof renderer === 'function') {
      return renderer(root);
    }
    console.warn('Módulo de pantalla cargado pero no tiene render exportado:', name);
    return null;
  } catch (err) {
    console.error('Error cargando pantalla', name, err);
    return Promise.reject(err);
  }
}

export default { navigateTo };
