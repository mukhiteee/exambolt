// ==========================================
// EXAMBOLT - DASHBOARD LOGIC
// Load user data, handle navigation
// ==========================================

const Dashboard = {
    /**
     * Initialize dashboard
     */
    init() {
        if (CONFIG.DEBUG) {
            console.log('🏠 Dashboard initialized');
        }
        
        setTimeout(() => {
            this.loadUserData();
            this.loadStats();
            this.updateDate();
            this.setupEventListeners();
        }, 100);
    },
    
    /**
     * Load user data
     */
    loadUserData() {
        const session = Storage.load('session');
        
        if (session && session.user) {
            const userName = session.user.name || 'Student';
            const userNameEl = document.getElementById('user-name');
            
            if (userNameEl) {
                userNameEl.textContent = userName.split(' ')[0]; // First name only
            }
            
            if (CONFIG.DEBUG) {
                console.log('👤 User:', userName);
            }
        }
    },
    
    /**
     * Update current date
     */
    updateDate() {
        const dateEl = document.getElementById('current-date');
        if (!dateEl) return;
        
        const options = { weekday: 'long', month: 'short', day: 'numeric' };
        const dateStr = new Date().toLocaleDateString('en-US', options);
        dateEl.textContent = dateStr;
    },
    
    /**
     * Load user stats (mock data for now)
     */
    loadStats() {
        // Mock stats - Replace with actual API call
        const stats = {
            progress: 67,
            streak: 5,
            questions: 124,
            accuracy: 85
        };
        
        // Animate stats
        this.animateValue('stat-progress', 0, stats.progress, 1000, '%');
        this.animateValue('stat-streak', 0, stats.streak, 1000, '');
        this.animateValue('stat-questions', 0, stats.questions, 1200, '');
        this.animateValue('stat-accuracy', 0, stats.accuracy, 1000, '%');
        
        if (CONFIG.DEBUG) {
            console.log('📊 Stats loaded:', stats);
        }
    },
    
    /**
     * Animate number values
     */
    animateValue(elementId, start, end, duration, suffix = '') {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const range = end - start;
        const increment = range / (duration / 16); // 60fps
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            
            element.textContent = Math.round(current) + suffix;
        }, 16);
    },
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Quick action buttons
        const startPractice = document.getElementById('start-practice');
        if (startPractice) {
            startPractice.addEventListener('click', () => this.handleStartPractice());
        }
        
        const continueLearning = document.getElementById('continue-learning');
        if (continueLearning) {
            continueLearning.addEventListener('click', () => this.handleContinueLearning());
        }
        
        const mockExam = document.getElementById('mock-exam');
        if (mockExam) {
            mockExam.addEventListener('click', () => this.handleMockExam());
        }
        
        // View all activity
        const viewAll = document.getElementById('view-all-activity');
        if (viewAll) {
            viewAll.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleViewAllActivity();
            });
        }
        
        // Bottom navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const nav = e.currentTarget.dataset.nav;
                this.handleNavigation(nav);
            });
        });
        
        if (CONFIG.DEBUG) {
            console.log('✅ Dashboard event listeners bound');
        }
    },
    
    /**
     * Handle quick actions
     */
    handleStartPractice() {
        if (CONFIG.DEBUG) {
            console.log('⚡ Starting practice...');
        }
        this.showToast('Practice mode coming soon!', 'info');
        // TODO: Navigate to practice screen
    },
    
    handleContinueLearning() {
        if (CONFIG.DEBUG) {
            console.log('📚 Continue learning...');
        }
        this.showToast('Continue learning coming soon!', 'info');
        // TODO: Navigate to last study topic
    },
    
    handleMockExam() {
        if (CONFIG.DEBUG) {
            console.log('📊 Starting mock exam...');
        }
        this.showToast('Mock exam coming soon!', 'info');
        // TODO: Navigate to mock exam screen
    },
    
    handleViewAllActivity() {
        if (CONFIG.DEBUG) {
            console.log('👀 View all activity...');
        }
        this.showToast('Activity history coming soon!', 'info');
        // TODO: Navigate to activity screen
    },
    
    /**
     * Handle bottom navigation
     */
    handleNavigation(nav) {
        if (CONFIG.DEBUG) {
            console.log('🧭 Navigate to:', nav);
        }
        
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        document.querySelector(`[data-nav="${nav}"]`).classList.add('active');
        
        // Handle navigation
        switch (nav) {
            case 'home':
                // Already on home
                break;
                
            case 'study':
                this.showToast('Study section coming soon!', 'info');
                // TODO: Load study section
                break;
                
            case 'analytics':
                this.showToast('Analytics coming soon!', 'info');
                // TODO: Load analytics section
                break;
                
            case 'profile':
                this.handleProfileClick();
                break;
        }
    },
    
    /**
     * Handle profile navigation
     */
    handleProfileClick() {
        const session = Storage.load('session');
        
        if (session && session.user) {
            const user = session.user;
            
            // Show user info alert for now
            const message = `
Name: ${user.name || 'Not set'}
Email: ${user.email || 'Not set'}
Exam: ${user.exam || 'Not set'}
Education: ${user.education || 'Not set'}
            `.trim();
            
            if (confirm(message + '\n\nWould you like to log out?')) {
                this.handleLogout();
            }
        }
    },
    
    /**
     * Handle logout
     */
    async handleLogout() {
        if (CONFIG.DEBUG) {
            console.log('🚪 Logging out...');
        }
        
        // Clear session
        Storage.clear();
        
        // Navigate to auth
        await Router.showPage('auth');
        
        this.showToast('Logged out successfully', 'success');
    },
    
    /**
     * Show toast notification
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
};s