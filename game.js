class Game {
    constructor() {
        this.players = [];
        this.impostorIndex = -1;
        this.impostorIndices = [];
        this.secretWord = '';
        this.impostorWord = ''; // Per mode boig
        this.category = '';
        this.currentPlayerIndex = 0;
        this.cardFlipped = false;
        this.gamesPlayed = parseInt(localStorage.getItem('gamesPlayed') || '0');
        this.soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
        this.impostorCount = parseInt(localStorage.getItem('impostorCount') || '1');
        this.darkMode = localStorage.getItem('darkMode') !== 'false';
        this.gameMode = 'normal'; // normal, hardcore, crazy
        this.initAudio();
        this.applyDarkMode();
    }

    initAudio() {
        // Crear contexto de audio
        this.audioContext = null;
        
        // Inicializar en el primer toque del usuario
        document.addEventListener('touchstart', () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
        }, { once: true });
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        localStorage.setItem('soundEnabled', this.soundEnabled.toString());
        const icon = document.getElementById('sound-icon');
        const btn = document.getElementById('sound-toggle');
        icon.textContent = this.soundEnabled ? '🔊' : '🔇';
        btn.classList.toggle('muted', !this.soundEnabled);
        this.vibrate(30);
    }

    showModeSelect() {
        this.vibrate(30);
        this.showScreen('screen-mode-select');
    }

    selectMode(mode) {
        this.gameMode = mode;
        this.vibrate(50);
        this.goToPlayers();
    }

    showSettings() {
        this.vibrate(30);
        this.showScreen('screen-settings');
        document.getElementById('impostor-count').value = this.impostorCount.toString();
    }

    backToHome() {
        this.vibrate(30);
        this.showScreen('screen-home');
    }

    updateImpostorCount() {
        this.impostorCount = parseInt(document.getElementById('impostor-count').value);
        localStorage.setItem('impostorCount', this.impostorCount.toString());
        this.vibrate(30);
    }

    toggleDarkMode() {
        this.darkMode = !this.darkMode;
        localStorage.setItem('darkMode', this.darkMode.toString());
        this.applyDarkMode();
        this.vibrate(30);
    }

    applyDarkMode() {
        if (this.darkMode) {
            document.body.classList.remove('light-mode');
            document.getElementById('dark-mode-text').textContent = 'Activat';
        } else {
            document.body.classList.add('light-mode');
            document.getElementById('dark-mode-text').textContent = 'Desactivat';
        }
    }

    playWhoosh() {
        if (!this.audioContext || !this.soundEnabled) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }

    playRevealSound(isImpostor) {
        if (!this.audioContext || !this.soundEnabled) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        if (isImpostor) {
            // Sonido dramático para impostor
            oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.5);
            gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
            oscillator.stop(this.audioContext.currentTime + 0.5);
        } else {
            // Sonido suave para jugador normal
            oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.2);
            gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
            oscillator.stop(this.audioContext.currentTime + 0.2);
        }
        
        oscillator.start(this.audioContext.currentTime);
    }

    vibrate(pattern) {
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    }

    goToPlayers() {
        this.vibrate(30);
        this.showScreen('screen-players');
        document.getElementById('player-input').focus();
    }

    updateGamesCounter() {
        document.getElementById('games-count').textContent = this.gamesPlayed;
    }

    addPlayer() {
        const input = document.getElementById('player-input');
        const name = input.value.trim();
        
        if (name === '') return;
        
        if (this.players.includes(name)) {
            alert('Aquest jugador ja existeix!');
            this.vibrate(100);
            return;
        }
        
        this.players.push(name);
        this.updatePlayersList();
        input.value = '';
        input.focus();
        this.vibrate(30);
        
        if (this.players.length >= 3) {
            document.getElementById('btn-start-game').classList.remove('hidden');
        }
    }

    updatePlayersList() {
        const list = document.getElementById('players-list');
        list.innerHTML = '';
        
        this.players.forEach((player, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${player}</span>
                <button onclick="game.removePlayer(${index})">Eliminar</button>
            `;
            list.appendChild(li);
        });
    }

    removePlayer(index) {
        this.players.splice(index, 1);
        this.updatePlayersList();
        this.vibrate(50);
        
        if (this.players.length < 3) {
            document.getElementById('btn-start-game').classList.add('hidden');
        }
    }

    startGame() {
        const minPlayers = this.impostorCount + 2;
        if (this.players.length < minPlayers) {
            alert(`Necessites almenys ${minPlayers} jugadors per ${this.impostorCount} impostor(s)!`);
            this.vibrate(100);
            return;
        }
        
        this.vibrate(50);
        
        // Seleccionar impostors aleatoris
        this.impostorIndices = [];
        const availableIndices = [...Array(this.players.length).keys()];
        
        for (let i = 0; i < this.impostorCount; i++) {
            const randomIndex = Math.floor(Math.random() * availableIndices.length);
            this.impostorIndices.push(availableIndices[randomIndex]);
            availableIndices.splice(randomIndex, 1);
        }
        
        // Mantenir compatibilitat amb impostorIndex
        this.impostorIndex = this.impostorIndices[0];
        
        // Seleccionar categoria i paraula secreta aleatòria
        const categories = Object.keys(WORDS);
        this.category = categories[Math.floor(Math.random() * categories.length)];
        const wordsInCategory = WORDS[this.category];
        this.secretWord = wordsInCategory[Math.floor(Math.random() * wordsInCategory.length)];
        
        // Mode boig: seleccionar una paraula diferent per l'impostor
        if (this.gameMode === 'crazy') {
            const otherWords = wordsInCategory.filter(w => w !== this.secretWord);
            this.impostorWord = otherWords[Math.floor(Math.random() * otherWords.length)];
        }
        
        // Començar reparto
        this.currentPlayerIndex = 0;
        this.showRevealScreen();
    }

    showRevealScreen() {
        this.showScreen('screen-reveal');
        this.cardFlipped = false;
        
        const flipCard = document.getElementById('flip-card');
        const flipCardInner = flipCard.querySelector('.flip-card-inner');
        
        // Reset de la targeta
        flipCard.classList.remove('flipped');
        flipCardInner.style.transition = 'none';
        flipCardInner.style.transform = 'rotateY(0deg)';
        
        // Forçar reflow
        void flipCard.offsetWidth;
        
        flipCardInner.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
        
        document.getElementById('current-player-name').textContent = this.players[this.currentPlayerIndex];
        document.getElementById('btn-next-player').classList.add('hidden');
        document.getElementById('btn-start-round').classList.add('hidden');
        
        // Configurar el contingut de la targeta
        const categoryText = document.getElementById('category-text');
        const wordText = document.getElementById('word-text');
        
        const isImpostor = this.impostorIndices.includes(this.currentPlayerIndex);
        
        if (this.gameMode === 'normal') {
            // Mode normal: impostor veu categoria
            categoryText.textContent = this.category;
            if (isImpostor) {
                wordText.innerHTML = "🎭<br><br>Ets l'impostor!<br><br>No saps la paraula";
                wordText.style.color = '#ff5252';
            } else {
                wordText.textContent = this.secretWord;
                wordText.style.color = '#fff';
            }
        } else if (this.gameMode === 'hardcore') {
            // Mode hardcore: impostor NO veu categoria
            if (isImpostor) {
                categoryText.textContent = '???';
                wordText.innerHTML = "💀<br><br>Ets l'impostor!<br><br>No saps ni la categoria ni la paraula";
                wordText.style.color = '#ff5252';
            } else {
                categoryText.textContent = this.category;
                wordText.textContent = this.secretWord;
                wordText.style.color = '#fff';
            }
        } else if (this.gameMode === 'crazy') {
            // Mode boig: impostor no sap que és impostor i té paraula diferent
            categoryText.textContent = this.category;
            if (isImpostor) {
                wordText.textContent = this.impostorWord;
                wordText.style.color = '#ff5252';
            } else {
                wordText.textContent = this.secretWord;
                wordText.style.color = '#fff';
            }
        }
        
        // Afegir event listener per girar la targeta
        setTimeout(() => {
            this.setupCardFlip();
        }, 100);
    }

    setupCardFlip() {
        const flipCard = document.getElementById('flip-card');
        const flipCardInner = flipCard.querySelector('.flip-card-inner');
        
        let isDragging = false;
        let startX = 0;
        let currentRotation = 0;
        let velocity = 0;
        let lastX = 0;
        let lastTime = Date.now();
        
        const handleStart = (e) => {
            if (this.cardFlipped) return;
            
            e.preventDefault();
            isDragging = true;
            startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            lastX = startX;
            lastTime = Date.now();
            velocity = 0;
            
            flipCardInner.style.transition = 'none';
            flipCard.style.cursor = 'grabbing';
        };
        
        const handleMove = (e) => {
            if (!isDragging || this.cardFlipped) return;
            
            e.preventDefault();
            const currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            const diff = currentX - startX;
            const now = Date.now();
            const timeDiff = now - lastTime;
            
            // Calcular velocidad
            if (timeDiff > 0) {
                velocity = (currentX - lastX) / timeDiff;
            }
            
            lastX = currentX;
            lastTime = now;
            
            // Rotación con física suave
            currentRotation = Math.min(180, Math.max(0, diff * 0.8));
            flipCardInner.style.transform = `rotateY(${currentRotation}deg)`;
        };
        
        const handleEnd = (e) => {
            if (!isDragging || this.cardFlipped) return;
            
            isDragging = false;
            flipCard.style.cursor = 'grab';
            flipCardInner.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            
            // Física: si tiene velocidad o pasó del punto medio, completar el giro
            const shouldFlip = currentRotation > 90 || velocity > 0.5;
            
            if (shouldFlip) {
                flipCard.classList.add('flipped');
                this.cardFlipped = true;
                flipCardInner.style.transform = 'rotateY(180deg)';
                
                // Sonido y vibración al revelar
                this.playWhoosh();
                const isImpostor = this.impostorIndices.includes(this.currentPlayerIndex);
                
                setTimeout(() => {
                    this.playRevealSound(isImpostor);
                    if (isImpostor) {
                        this.vibrate([100, 50, 100, 50, 200]); // Patrón dramático
                    } else {
                        this.vibrate(50); // Vibración suave
                    }
                    document.getElementById('btn-next-player').classList.remove('hidden');
                }, 400);
            } else {
                // Volver a la posición inicial con rebote
                flipCardInner.style.transform = 'rotateY(0deg)';
                this.vibrate(20); // Feedback de rebote
            }
            
            currentRotation = 0;
            velocity = 0;
        };
        
        // Touch events
        flipCard.addEventListener('touchstart', handleStart, { passive: false });
        flipCard.addEventListener('touchmove', handleMove, { passive: false });
        flipCard.addEventListener('touchend', handleEnd);
        flipCard.addEventListener('touchcancel', handleEnd);
        
        // Mouse events
        flipCard.addEventListener('mousedown', handleStart);
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
        
        // Click simple como alternativa
        flipCard.addEventListener('click', (e) => {
            if (!isDragging && !this.cardFlipped) {
                flipCardInner.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
                flipCard.classList.add('flipped');
                this.cardFlipped = true;
                
                // Sonido y vibración
                this.playWhoosh();
                const isImpostor = this.impostorIndices.includes(this.currentPlayerIndex);
                
                setTimeout(() => {
                    this.playRevealSound(isImpostor);
                    if (isImpostor) {
                        this.vibrate([100, 50, 100, 50, 200]);
                    } else {
                        this.vibrate(50);
                    }
                    document.getElementById('btn-next-player').classList.remove('hidden');
                }, 400);
            }
        });
    }

    nextPlayer() {
        this.currentPlayerIndex++;
        
        if (this.currentPlayerIndex < this.players.length) {
            this.showRevealScreen();
        } else {
            // Tots els jugadors han vist la seva paraula
            document.getElementById('btn-next-player').classList.add('hidden');
            document.getElementById('btn-start-round').classList.remove('hidden');
        }
    }

    startRound() {
        this.showScreen('screen-round');
    }

    revealResult() {
        // Mostrar tots els impostors
        const impostorNames = this.impostorIndices.map(i => this.players[i]).join(', ');
        document.getElementById('impostor-name').textContent = impostorNames;
        document.getElementById('secret-word').textContent = this.secretWord;
        
        // Incrementar contador de partidas
        this.gamesPlayed++;
        localStorage.setItem('gamesPlayed', this.gamesPlayed.toString());
        
        // Vibración y sonido de revelación final
        this.vibrate([200, 100, 200]);
        
        this.showScreen('screen-result');
        
        // Confeti animation
        this.createConfetti();
    }

    createConfetti() {
        const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4CAF50', '#ffd700'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = Math.random() * 0.5 + 's';
                document.body.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 3000);
            }, i * 30);
        }
    }

    playAgain() {
        this.currentPlayerIndex = 0;
        this.startGame();
    }

    exit() {
        this.players = [];
        this.impostorIndex = -1;
        this.impostorIndices = [];
        this.secretWord = '';
        this.impostorWord = '';
        this.category = '';
        this.currentPlayerIndex = 0;
        this.cardFlipped = false;
        document.getElementById('players-list').innerHTML = '';
        document.getElementById('btn-start-game').classList.add('hidden');
        this.updateGamesCounter();
        this.showScreen('screen-home');
    }

    showScreen(screenId) {
        const currentScreen = document.querySelector('.screen.active');
        const nextScreen = document.getElementById(screenId);
        
        if (currentScreen) {
            currentScreen.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                currentScreen.classList.remove('active');
                currentScreen.style.animation = '';
                nextScreen.classList.add('active');
            }, 300);
        } else {
            nextScreen.classList.add('active');
        }
    }
}

const game = new Game();

// Permetre afegir jugadors amb Enter
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('player-input');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                game.addPlayer();
            }
        });
    }
    
    // Actualitzar contador de partides
    game.updateGamesCounter();
    
    // Actualitzar icona de so
    const soundIcon = document.getElementById('sound-icon');
    const soundBtn = document.getElementById('sound-toggle');
    soundIcon.textContent = game.soundEnabled ? '🔊' : '🔇';
    soundBtn.classList.toggle('muted', !game.soundEnabled);
});
