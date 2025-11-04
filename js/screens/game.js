// Pantalla del juego principal (tablero, marcador, botones)
import { createBackground } from '../components/background.js';
import { navigateTo } from '../core/screenManager.js';
import { createGame } from '../core/gameLogic.js';
import { Storage } from '../core/storage.js';
import { playMarkerSwap } from '../core/animationManager.js';
import { renderWinCpu } from './winCpu.js';
import { renderWinPlayer } from './winPlayer.js';
import { openRestart } from './restart.js';
import { createBoard } from '../components/board.js';
import { createScoreboard } from '../components/scoreboard.js';

export function renderGame(root = document.getElementById('app'), gameMode = 'pvp', players = {}) {
  if (!root) throw new Error('Contenedor principal no encontrado');

  // Robustez: si no vienen nombres por parámetro, usar sessionStorage
  const modeStored = sessionStorage.getItem('gameMode') || gameMode;
  const p1Name = players.player1 || sessionStorage.getItem('player1') || 'Jugador 1';
  const p2Default = modeStored === 'pvc' ? (sessionStorage.getItem('player2') || 'CPU') : (sessionStorage.getItem('player2') || 'Jugador 2');
  const p2Name = players.player2 || p2Default;

  root.innerHTML = '';
  root.className = 'screen-container is-game';

  const bg = createBackground({ imagePath: './assets/images/Background-Image.png', alt: 'Background' });
  root.appendChild(bg);

  const gameScreen = document.createElement('div');
  gameScreen.className = 'game-screen';
  gameScreen.style.zIndex = 2;

  // Botones superiores (Back y Restart) fijados en esquinas
  const backBtn = document.createElement('button');
  backBtn.className = 'game-icon-button back';
  backBtn.innerHTML = `<img src="assets/images/Icon ionic-md-arrow-back.svg" alt="Atrás" />`;
  backBtn.addEventListener('click', () => {
    navigateTo('gameModeSelection', root);
  });

  const restartBtn = document.createElement('button');
  restartBtn.className = 'game-icon-button restart';
  restartBtn.innerHTML = `<img src="assets/images/Icon ionic-md-refresh.svg" alt="Reiniciar" />`;
  // El manejo real de reinicio se conecta más abajo

  // Botones van fuera del game-screen, en el contenedor raíz
  root.appendChild(backBtn);
  root.appendChild(restartBtn);

  // Header con info de jugadores (fuera del contenedor de juego)
  const gameHeader = document.createElement('div');
  gameHeader.className = 'game-header';

  const player1Info = createPlayerInfo(p1Name, false, 'p1');
  const vsText = document.createElement('div');
  vsText.className = 'vs-text';
  vsText.textContent = 'VS';
  const player2Info = createPlayerInfo(p2Name, modeStored === 'pvc', 'p2');

  gameHeader.appendChild(player1Info.element ? player1Info.element : player1Info);
  gameHeader.appendChild(vsText);
  gameHeader.appendChild(player2Info.element ? player2Info.element : player2Info);
  gameScreen.appendChild(gameHeader);

  // Contenedor del juego
  const gameContainer = document.createElement('div');
  gameContainer.className = 'game-container';
  

  // Marcador (arriba del tablero) usando componente reusable
  const scoreboardComp = createScoreboard({
    p1Label: getInitials(p1Name),
    p2Label: modeStored === 'pvc' ? 'CPU' : getInitials(p2Name)
  });
  gameContainer.appendChild(scoreboardComp.element);

  // Tablero (componente)
  const boardComp = createBoard({ onCellClick: (i) => onCellClicked(i) });
  gameContainer.appendChild(boardComp.wrapper);
  gameScreen.appendChild(gameContainer);
  root.appendChild(gameScreen);

  // Estado inicial desde almacenamiento si existe
  const game = createGame({
    mode: modeStored,
    players: { player1: p1Name, player2: p2Name },
    onUpdate: (state) => {
      boardComp.update(state);
      scoreboardComp.update(state);
      renderHeaderMarkers(state);
    },
    onFinish: ({ winner, reason, state }) => {
      const isPVC = state.mode === 'pvc';
      const scores = state.scoreboard;
      const common = {
        scores: {
          p1Label: getInitials(state.players.p1Name),
          p2Label: (state.mode === 'pvc' ? 'CPU' : getInitials(state.players.p2Name)),
          p1Wins: scores.p1Wins,
          p2Wins: scores.p2Wins,
          ties: scores.ties,
        },
        onExit: () => navigateTo('gameModeSelection', root),
        onNextRound: () => game.startNextRound(),
      };

      if (isPVC) {
        renderWinCpu(root, { winner, reason, state, ...common });
      } else {
        renderWinPlayer(root, { winner, reason, state, ...common });
      }
    },
  });

  // Wire botones
  restartBtn.addEventListener('click', () => {
    openRestart(root, {
      onCancel: () => {},
      onConfirm: () => {
        game.resetPositions();
      },
    });
  });

  function onCellClicked(index) {
    const st = game.getState();
    if (st.finished) return;
    // En PVC, bloquear cuando es turno del CPU
    if (st.mode === 'pvc' && st.turnMark === st.marks.p2) return;
    if (st.board[index] != null) return;
    game.playCell(index);
  }

  // El render del tablero lo maneja el componente boardComp

  // Guardar los signos previos para detectar cambios y animar
  let lastMarks = null;

  function applyHeaderClasses(elContainer, mark) {
    if (!elContainer) return;
    elContainer.classList.remove('has-x', 'has-o');
    if (mark === 'X') elContainer.classList.add('has-x');
    else if (mark === 'O') elContainer.classList.add('has-o');
  }

  function renderHeaderMarkers(state) {
    setMarkerSVG(player1Info.markerEl, state.marks.p1);
    setMarkerSVG(player2Info.markerEl, state.marks.p2);
    applyHeaderClasses(player1Info.element, state.marks.p1);
    applyHeaderClasses(player2Info.element, state.marks.p2);
    // Animar cuando cambian los signos respecto al último estado
    if (lastMarks && (lastMarks.p1 !== state.marks.p1)) {
      playMarkerSwap(player1Info.element);
    }
    if (lastMarks && (lastMarks.p2 !== state.marks.p2)) {
      playMarkerSwap(player2Info.element);
    }
    lastMarks = { ...state.marks };
  }

  // Inicializar marcadores al cargar
  renderHeaderMarkers(game.getState());

  // Actualiza los marcadores (X/O) en la cabecera según la asignación de la ronda
  function setMarkerSVG(el, mark) {
    if (!el) return;
    if (mark === 'X') {
      el.innerHTML = `<img src="assets/images/Icon ionic-ios-close.svg" alt="X" />`;
    } else {
      el.innerHTML = `<img src="assets/images/Path 6.svg" alt="O" />`;
    }
  }

  return { root, bg, gameContainer, board: boardComp.board, backBtn, restartBtn };
}

function createPlayerInfo(name, isCPU = false, sideClass = 'p1') {
  const info = document.createElement('div');
  info.className = 'player-info';

  const nameEl = document.createElement('div');
  nameEl.className = 'player-name';
  nameEl.textContent = name;

  const avatar = document.createElement('div');
  avatar.className = `player-avatar ${sideClass}`;
  avatar.textContent = isCPU ? 'CPU' : getInitials(name);

  const markerEl = document.createElement('div');
  markerEl.className = `player-marker ${sideClass}`;

  avatar.appendChild(markerEl);
  info.appendChild(nameEl);
  info.appendChild(avatar);

  return { element: info, markerEl };
}



function getInitials(name) {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}
