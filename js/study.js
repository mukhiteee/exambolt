// ==========================================
// EXAMBOLT - STUDY HUB LOGIC
// ==========================================

const Study = {
    currentTab: 'courses',
    
    init() {
        if (CONFIG.DEBUG) {
            console.log('📚 Study Hub initialized');
        }
        
        setTimeout(() => {
            this.setupTabs();
            this.setupEventListeners();
            this.setupNavigation();
        }, 100);
    },
    
    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.switchTab(tab);
            });
        });
    },
    
    switchTab(tab) {
        // Update buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        
        // Update content
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(`tab-${tab}`).classList.add('active');
        
        this.currentTab = tab;
        
        if (CONFIG.DEBUG) {
            console.log('📑 Switched to tab:', tab);
        }
    },
    
    setupEventListeners() {
        // Course cards
        document.querySelectorAll('.course-card').forEach(card => {
            card.addEventListener('click', () => {
                this.showToast('Course details coming soon!', 'info');
            });
        });
        
        // Practice buttons
        document.querySelectorAll('.practice-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showToast('Starting practice...', 'info');
            });
        });
        
        // AI Generator
        const aiCreateBtn = document.querySelector('.ai-create-btn');
        if (aiCreateBtn) {
            aiCreateBtn.addEventListener('click', () => {
                const input = document.querySelector('.ai-input');
                if (input && input.value.trim()) {
                    this.showToast('Generating flashcards...', 'info');
                    input.value = '';
                } else {
                    this.showToast('Please enter a topic', 'warning');
                }
            });
        }
        
        // New note
        const newNoteBtn = document.querySelector('.new-note-card');
        if (newNoteBtn) {
            newNoteBtn.addEventListener('click', () => {
                this.showToast('Note editor coming soon!', 'info');
            });
        }
    },
    
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const nav = e.currentTarget.dataset.nav;
                this.handleNavigation(nav);
            });
        });
        
        const fabBtn = document.getElementById('fab-button');
        if (fabBtn) {
            fabBtn.addEventListener('click', () => {
                this.showToast('Quick actions coming soon!', 'info');
            });
        }
    },
    
    async handleNavigation(nav) {
        switch (nav) {
            case 'home':
                await Router.showPage('dashboard');
                break;
            case 'study':
                // Already here
                break;
            case 'analytics':
                await Router.showPage('analytics');
                break;
            case 'profile':
                await Router.showPage('profile');
                break;
        }
    },
    
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