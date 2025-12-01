class Game {
    constructor() {
        this.players = [];
        this.impostorIndex = -1;
        this.secretWord = '';
        this.category = '';
        this.currentPlayerIndex = 0;
        this.cardFlipped = false;
    }

    goToPlayers() {
        this.showScreen('screen-players');
        document.getElementById('player-input').focus();
    }

    addPlayer() {
        const input = document.getElementById('player-input');
        const name = input.value.trim();
        
        if (name === '') return;
        
        if (this.players.includes(name)) {
            alert('Aquest jugador ja existeix!');
            return;
        }
        
        this.players.push(name);
        this.updatePlayersList();
        input.value = '';
        input.focus();
        
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
        
        if (this.players.length < 3) {
            document.getElementById('btn-start-game').classList.add('hidden');
        }
    }

    startGame() {
        if (this.players.length < 3) {
            alert('Necessites almenys 3 jugadors!');
            return;
        }
        
        // Seleccionar impostor aleatori
        this.impostorIndex = Math.floor(Math.random() * this.players.length);
        
        // Seleccionar categoria i paraula secreta aleatòria
        const categories = Object.keys(WORDS);
        this.category = categories[Math.floor(Math.random() * categories.length)];
        const wordsInCategory = WORDS[this.category];
        this.secretWord = wordsInCategory[Math.floor(Math.random() * wordsInCategory.length)];
        
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
        
        categoryText.textContent = this.category;
        
        if (this.currentPlayerIndex === this.impostorIndex) {
            wordText.innerHTML = "🎭<br><br>Ets l'impostor!<br><br>No saps la paraula";
            wordText.style.color = '#ff5252';
        } else {
            wordText.textContent = this.secretWord;
            wordText.style.color = '#fff';
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
                
                setTimeout(() => {
                    document.getElementById('btn-next-player').classList.remove('hidden');
                }, 400);
            } else {
                // Volver a la posición inicial con rebote
                flipCardInner.style.transform = 'rotateY(0deg)';
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
                
                setTimeout(() => {
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
        document.getElementById('impostor-name').textContent = this.players[this.impostorIndex];
        document.getElementById('secret-word').textContent = this.secretWord;
        this.showScreen('screen-result');
    }

    playAgain() {
        this.currentPlayerIndex = 0;
        this.startGame();
    }

    exit() {
        this.players = [];
        this.impostorIndex = -1;
        this.secretWord = '';
        this.category = '';
        this.currentPlayerIndex = 0;
        this.cardFlipped = false;
        document.getElementById('players-list').innerHTML = '';
        document.getElementById('btn-start-game').classList.add('hidden');
        this.showScreen('screen-home');
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
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
});
