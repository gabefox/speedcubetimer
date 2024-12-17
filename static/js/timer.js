class SpeedTimer {
    constructor() {
        this.timerDisplay = document.getElementById('timer');
        this.scrambleDisplay = document.getElementById('scramble');
        this.lastTimeDisplay = document.getElementById('lastTime');
        this.ao5Display = document.getElementById('ao5');
        this.ao12Display = document.getElementById('ao12');
        
        this.times = JSON.parse(localStorage.getItem('solveTimes') || '[]');
        this.isHolding = false;
        this.isRunning = false;
        this.startTime = 0;
        this.holdStartTime = 0;
        this.animationFrameId = null;
        
        this.initializeEventListeners();
        this.updateStats();
        this.generateNewScramble();
    }

    initializeEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isHolding && !this.isRunning) {
                e.preventDefault();
                this.startHolding();
            } else if (this.isRunning) {
                this.stopTimer();
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.code === 'Space' && this.isHolding) {
                e.preventDefault();
                this.startTimer();
            }
        });
    }

    startHolding() {
        this.isHolding = true;
        this.holdStartTime = Date.now();
        this.timerDisplay.classList.add('timer-ready');
        this.scrambleDisplay.style.opacity = '0';
    }

    startTimer() {
        if (Date.now() - this.holdStartTime >= 500) {
            this.isHolding = false;
            this.isRunning = true;
            this.startTime = Date.now();
            this.timerDisplay.classList.remove('timer-ready');
            this.timerDisplay.classList.add('timer-running');
            this.updateTimer();
        } else {
            this.resetState();
        }
    }

    stopTimer() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        const endTime = Date.now();
        const solveTime = (endTime - this.startTime) / 1000;
        
        this.times.push(solveTime);
        localStorage.setItem('solveTimes', JSON.stringify(this.times));
        
        this.timerDisplay.classList.remove('timer-running');
        this.scrambleDisplay.style.opacity = '1';
        this.updateStats();
        this.generateNewScramble();
        updateChart(this.times);
        
        cancelAnimationFrame(this.animationFrameId);
    }

    updateTimer() {
        if (!this.isRunning) return;
        
        const currentTime = (Date.now() - this.startTime) / 1000;
        this.timerDisplay.textContent = currentTime.toFixed(2);
        this.animationFrameId = requestAnimationFrame(() => this.updateTimer());
    }

    resetState() {
        this.isHolding = false;
        this.timerDisplay.classList.remove('timer-ready');
        this.scrambleDisplay.style.opacity = '1';
    }

    generateNewScramble() {
        this.scrambleDisplay.textContent = scrambler.generateScramble();
    }

    calculateAverage(times, n) {
        if (times.length < n) return null;
        const recent = times.slice(-n);
        const sorted = [...recent].sort((a, b) => a - b);
        
        if (n === 5) {
            sorted.pop();
            sorted.shift();
            return sorted.reduce((a, b) => a + b, 0) / 3;
        } else if (n === 12) {
            sorted.pop();
            sorted.shift();
            return sorted.reduce((a, b) => a + b, 0) / 10;
        }
        return null;
    }

    updateStats() {
        const lastTime = this.times[this.times.length - 1];
        const ao5 = this.calculateAverage(this.times, 5);
        const ao12 = this.calculateAverage(this.times, 12);

        this.lastTimeDisplay.textContent = lastTime ? lastTime.toFixed(2) : '-';
        this.ao5Display.textContent = ao5 ? ao5.toFixed(2) : '-';
        this.ao12Display.textContent = ao12 ? ao12.toFixed(2) : '-';
    }
}

const timer = new SpeedTimer();
