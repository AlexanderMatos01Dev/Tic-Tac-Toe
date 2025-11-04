// Control centralizado de sonidos (click, victoria, empate, etc.)

class AudioManager {
  constructor() {
    this.sounds = {
      click: new Audio('assets/sounds/653369__triqystudio__sharpclick.wav'),
      bgMusic: new Audio('assets/sounds/Círculos y Cruces.mp3'),
      gameOver: new Audio('assets/sounds/game-over-417465.mp3'),
      gameStart: new Audio('assets/sounds/game-start-317318.mp3'),
      winner: new Audio('assets/sounds/winner-game-sound-404167.mp3')
    };
    
    // Configurar música de fondo
    this.sounds.bgMusic.loop = true;
    this.sounds.bgMusic.volume = 0.3; // 30% (bajado de 50%)
    
    // Volumen de efectos de sonido
    this.sounds.click.volume = 0.7;
    this.sounds.gameOver.volume = 0.8;
    this.sounds.gameStart.volume = 0.8;
    this.sounds.winner.volume = 0.8;
    
    this.isMusicPlaying = false;
  }
  
  playClick() {
    this.sounds.click.currentTime = 0;
    this.sounds.click.play().catch(e => console.log('Audio play failed:', e));
  }
  
  playGameStart() {
    this.sounds.gameStart.currentTime = 0;
    this.sounds.gameStart.play().catch(e => console.log('Audio play failed:', e));
  }
  
  playWinner() {
    this.sounds.winner.currentTime = 0;
    this.sounds.winner.play().catch(e => console.log('Audio play failed:', e));
  }
  
  playGameOver() {
    this.sounds.gameOver.currentTime = 0;
    this.sounds.gameOver.play().catch(e => console.log('Audio play failed:', e));
  }
  
  playTie() {
    // Usar sonido de winner para empate
    this.playWinner();
  }
  
  startBackgroundMusic() {
    if (!this.isMusicPlaying) {
      this.sounds.bgMusic.play().catch(e => console.log('Music play failed:', e));
      this.isMusicPlaying = true;
    }
  }
  
  stopBackgroundMusic() {
    this.sounds.bgMusic.pause();
    this.sounds.bgMusic.currentTime = 0;
    this.isMusicPlaying = false;
  }
  
  pauseBackgroundMusic() {
    this.sounds.bgMusic.pause();
  }
  
  resumeBackgroundMusic() {
    if (this.isMusicPlaying) {
      this.sounds.bgMusic.play().catch(e => console.log('Music play failed:', e));
    }
  }
  
  // Bajar volumen de música cuando termina la partida
  lowerMusicVolume() {
    this.sounds.bgMusic.volume = 0.15; // Bajar a 15%
  }
  
  // Restaurar volumen normal de música
  restoreMusicVolume() {
    this.sounds.bgMusic.volume = 0.3; // Volver a 30%
  }
}

// Exportar instancia única
export const audioManager = new AudioManager();
