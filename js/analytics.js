// ==========================================
// EXAMBOLT - ANALYTICS LOGIC
// Load and display performance data
// ==========================================

const Analytics = {
    /**
     * Initialize analytics screen
     */
    init() {
        if (CONFIG.DEBUG) {
            console.log('📊 Analytics initialized');
        }
        
        setTimeout(() => {
            this.loadData();
            this.setupEventListeners();
            this.setupNavigation();
        }, 100);
    },
    
    /**
     * Load analytics data
     */
    loadData() {
        // Mock data - Replace with API call
        const data = {
            totalQuestions: 124,
            totalCorrect: 98,
            accuracyRate: 79,
            studyTime: 12.5
        };
        
        // Animate values
        this.animateValue('total-questions', 0, data.totalQuestions, 1000, '');
        this.animateValue('total-correct', 0, data.totalCorrect, 1000, '');
        this.animateValue('accuracy-rate', 0, data.accuracyRate, 1000, '%');
        
        // Study time (decimal)
        const studyTimeEl = document.getElementById('study-time');
        if (studyTimeEl) {
            studyTimeEl.textContent = `${data.studyTime}h`;
        }
        
        if (CONFIG.DEBUG) {
            console.log('📈 Analytics data loaded:', data);
        }
    },
    
    /**
     * Animate number values
     */
    animateValue(elementId, start, end, duration, suffix = '') {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const range = end - start;
        const increment = range / (duration / 16);
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
        // Back button
        const backBtn = document.getElementById('analytics-back');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.handleBack());
        }
        
        if (CONFIG.DEBUG) {
            console.log('✅ Analytics listeners bound');
        }
    },
    
    /**
     * Setup bottom navigation
     */
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const nav = e.currentTarget.dataset.nav;
                this.handleNavigation(nav);
            });
        });
    },
    
    /**
     * Handle back button
     */
    async handleBack() {
        await Router.showPage('dashboard');
    },
    
    /**
     * Handle bottom navigation
     */
    async handleNavigation(nav) {
        if (CONFIG.DEBUG) {
            console.log('🧭 Navigate to:', nav);
        }
        
        switch (nav) {
            case 'home':
                await Router.showPage('dashboard');
                break;
                
            case 'study':
                await Router.showPage('study');
                break;
                
            case 'analytics':
                // Already on analytics
                break;
                
            case 'profile':
                await Router.showPage('profile');
                break;
        }
    }
};