// ==========================================
// EXAMBOLT - QUIZ LOGIC
// Question flow, answer checking, timer
// ==========================================

const Quiz = {
    currentQuestion: 0,
    totalQuestions: 10,
    score: 0,
    selectedAnswer: null,
    timer: null,
    timeRemaining: 300, // 5 minutes
    
    // Mock questions (Replace with API data)
    questions: [
        {
            id: 1,
            text: "Solve for x: 2x + 5 = 15",
            options: [
                { letter: "A", text: "x = 5", correct: true },
                { letter: "B", text: "x = 10", correct: false },
                { letter: "C", text: "x = 7.5", correct: false },
                { letter: "D", text: "x = 15", correct: false }
            ],
            explanation: "To solve 2x + 5 = 15: Subtract 5 from both sides: 2x = 10. Divide both sides by 2: x = 5"
        },
        {
            id: 2,
            text: "What is the capital of France?",
            options: [
                { letter: "A", text: "London", correct: false },
                { letter: "B", text: "Berlin", correct: false },
                { letter: "C", text: "Paris", correct: true },
                { letter: "D", text: "Madrid", correct: false }
            ],
            explanation: "Paris is the capital and largest city of France."
        }
        // More questions would be loaded from API
    ],
    
    /**
     * Initialize quiz
     */
    init() {
        if (CONFIG.DEBUG) {
            console.log('📝 Quiz initialized');
        }
        
        setTimeout(() => {
            this.setupEventListeners();
            this.loadQuestion();
            this.startTimer();
        }, 100);
    },
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Exit button
        const exitBtn = document.getElementById('quiz-exit');
        if (exitBtn) {
            exitBtn.addEventListener('click', () => this.handleExit());
        }
        
        // Options
        const options = document.querySelectorAll('.option-btn');
        options.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const option = e.currentTarget.dataset.option;
                this.selectOption(option);
            });
        });
        
        // Navigation
        document.getElementById('quiz-prev')?.addEventListener('click', () => this.prevQuestion());
        document.getElementById('quiz-next')?.addEventListener('click', () => this.nextQuestion());
        
        // Explanation modal
        document.getElementById('explanation-close')?.addEventListener('click', () => this.closeExplanation());
        document.getElementById('explanation-continue')?.addEventListener('click', () => this.closeExplanation());
        
        if (CONFIG.DEBUG) {
            console.log('✅ Quiz listeners bound');
        }
    },
    
    /**
     * Load current question
     */
    loadQuestion() {
        const question = this.questions[this.currentQuestion];
        if (!question) return;
        
        // Update question display
        document.getElementById('question-number').textContent = `Question ${this.currentQuestion + 1}`;
        document.getElementById('question-text').textContent = question.text;
        
        // Update progress
        document.getElementById('quiz-progress-text').textContent = 
            `Question ${this.currentQuestion + 1} of ${this.totalQuestions}`;
        
        const progress = ((this.currentQuestion + 1) / this.totalQuestions) * 100;
        document.getElementById('quiz-progress-fill').style.width = `${progress}%`;
        
        // Update options
        const optionBtns = document.querySelectorAll('.option-btn');
        question.options.forEach((opt, index) => {
            const btn = optionBtns[index];
            if (btn) {
                btn.dataset.option = opt.letter;
                btn.querySelector('.option-letter').textContent = opt.letter;
                btn.querySelector('.option-text').textContent = opt.text;
                btn.classList.remove('selected', 'correct', 'wrong');
            }
        });
        
        // Update nav buttons
        document.getElementById('quiz-prev').disabled = this.currentQuestion === 0;
        
        this.selectedAnswer = null;
    },
    
    /**
     * Select option
     */
    selectOption(option) {
        if (this.selectedAnswer) return; // Already answered
        
        // Mark as selected
        const optionBtns = document.querySelectorAll('.option-btn');
        optionBtns.forEach(btn => {
            btn.classList.remove('selected');
            if (btn.dataset.option === option) {
                btn.classList.add('selected');
            }
        });
        
        this.selectedAnswer = option;
        
        // Auto-submit and show explanation
        setTimeout(() => this.checkAnswer(), 300);
    },
    
    /**
     * Check answer
     */
    checkAnswer() {
        const question = this.questions[this.currentQuestion];
        const correctOption = question.options.find(opt => opt.correct);
        const selectedOption = question.options.find(opt => opt.letter === this.selectedAnswer);
        
        const isCorrect = selectedOption?.correct || false;
        
        if (isCorrect) {
            this.score++;
        }
        
        // Show visual feedback
        const optionBtns = document.querySelectorAll('.option-btn');
        optionBtns.forEach(btn => {
            const letter = btn.dataset.option;
            
            if (letter === correctOption.letter) {
                btn.classList.add('correct');
            } else if (letter === this.selectedAnswer && !isCorrect) {
                btn.classList.add('wrong');
            }
        });
        
        // Show explanation
        setTimeout(() => this.showExplanation(isCorrect), 600);
    },
    
    /**
     * Show explanation modal
     */
    showExplanation(isCorrect) {
        const modal = document.getElementById('explanation-modal');
        const result = document.getElementById('explanation-result');
        const explanation = document.getElementById('explanation-text');
        
        // Update result
        result.classList.remove('correct', 'wrong');
        result.classList.add(isCorrect ? 'correct' : 'wrong');
        result.querySelector('.result-text').textContent = isCorrect ? 'Correct!' : 'Incorrect';
        result.querySelector('.result-icon').textContent = isCorrect ? '✓' : '✗';
        
        // Update explanation
        const question = this.questions[this.currentQuestion];
        explanation.innerHTML = question.explanation;
        
        // Show modal
        modal.classList.add('active');
    },
    
    /**
     * Close explanation
     */
    closeExplanation() {
        const modal = document.getElementById('explanation-modal');
        modal.classList.remove('active');
    },
    
    /**
     * Next question
     */
    nextQuestion() {
        if (!this.selectedAnswer) {
            this.showToast('Please select an answer', 'warning');
            return;
        }
        
        this.closeExplanation();
        
        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion++;
            this.loadQuestion();
        } else {
            this.finishQuiz();
        }
    },
    
    /**
     * Previous question
     */
    prevQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.loadQuestion();
        }
    },
    
    /**
     * Start timer
     */
    startTimer() {
        this.timer = setInterval(() => {
            this.timeRemaining--;
            
            const minutes = Math.floor(this.timeRemaining / 60);
            const seconds = this.timeRemaining % 60;
            const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            const timerEl = document.getElementById('quiz-timer');
            timerEl.textContent = display;
            
            // Warning at 1 minute
            if (this.timeRemaining <= 60) {
                timerEl.classList.add('warning');
            }
            
            // Time's up
            if (this.timeRemaining <= 0) {
                this.finishQuiz();
            }
        }, 1000);
    },
    
    /**
     * Finish quiz
     */
    finishQuiz() {
        clearInterval(this.timer);
        
        const percentage = Math.round((this.score / this.questions.length) * 100);
        
        alert(`Quiz Complete!\n\nScore: ${this.score}/${this.questions.length} (${percentage}%)`);
        
        // Go back to dashboard
        Router.showPage('dashboard');
    },
    
    /**
     * Handle exit
     */
    handleExit() {
        if (confirm('Are you sure you want to exit? Your progress will be lost.')) {
            clearInterval(this.timer);
            Router.showPage('dashboard');
        }
    },
    
    /**
     * Show toast
     */
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('exit');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};