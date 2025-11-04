Tic-Tac-Toe (HTML/CSS/JS)

Proyecto de tres en raya con interfaz moderna, audio, lógica de turnos basada en eventos y persistencia de partidas. No requiere backend ni instalación: funciona en cualquier navegador moderno.

## Características

- Modos: Jugador vs Jugador (PvP) y Jugador vs CPU (PVC)
- Lógica de turnos basada en eventos con cuenta regresiva de inicio
- Sonidos: click, inicio, victoria, derrota y música de fondo con control de volumen
- Persistencia: partidas con IDs únicos, reanudación y limpieza automática (7 días)
- UI responsive (tablets y móviles), animaciones y marcador alineado

## Requisitos

- Navegador moderno (Chrome, Edge, Firefox, Safari)
- Opcional para server local: VS Code + Live Server, Live Preview o Python 3
- Live Preview (Microsoft) recomendado: ms-vscode.livepreview v0.4.14 o superior

## Cómo ejecutar

Puedes abrir directamente el `index.html` en tu navegador. Para rutas y assets consistentes, se recomienda servir el proyecto en local.

### Opción A: VS Code + Live Server (recomendado)

1. Abre la carpeta del proyecto en VS Code
2. Instala la extensión “Live Server” (ritwickdey.LiveServer)
3. Click en “Go Live” (esquina inferior derecha) o botón “Open with Live Server” en `index.html`
4. Se abrirá en un puerto local (por ejemplo http://127.0.0.1:5500)


### Opción A (alternativa): VS Code + Live Preview (Microsoft)

1. Abre la carpeta del proyecto en VS Code
2. Instala “Live Preview” (ID: ms-vscode.livepreview), versión recomendada v0.4.14+
3. Abre `index.html` y ejecuta el comando “Live Preview: Start Server”
4. Se abrirá en un puerto local (por ejemplo http://127.0.0.1:3000)



### Opción B: Python 3 (Windows PowerShell)

1. Abre PowerShell en la carpeta del proyecto
2. Ejecuta:

```powershell
python -m http.server 5500
```

3. Abre en el navegador: http://localhost:5500/

Si tienes varias versiones de Python, puedes usar `py -3 -m http.server 5500`.

## Estructura básica

```
index.html
assets/
	images/
	sounds/
css/
	animations.css
	base.css
	components.css
	layout.css
	screens.css
	partials/
		variables.css
		game.css
		modal.css
		loading.css
		buttons.css
		forms.css
js/
	main.js
	core/
		gameLogic.js
		audioManager.js
		sessionManager.js
		storage.js
		cpuLogic.js
		utils.js
	components/
		board.js
		scoreboard.js
		modal.js
	screens/
		home.js
		loading.js
		game.js
		playerVsPlayer.js
		playerVsCpu.js
```

## Consejos de desarrollo

- Usa Live Server para recarga rápida
- Las variables CSS en `partials/variables.css` controlan escalas y tamaños base
- La lógica del juego está en `js/core/gameLogic.js`; la pantalla principal en `js/screens/game.js`
- Los sonidos están en `assets/sounds`; las imágenes en `assets/images`

## Utilidades de depuración

En la consola del navegador:

- `TTT.listSessions()` — lista partidas guardadas
- `TTT.clearSessions()` — limpia todas las partidas

 

