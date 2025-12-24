// ==========================================
// EXAMBOLT - PROFILE LOGIC
// User profile, settings, logout
// ==========================================

const Profile = {
    /**
     * Initialize profile screen
     */
    init() {
        if (CONFIG.DEBUG) {
            console.log('👤 Profile initialized');
        }
        
        setTimeout(() => {
            this.loadUserData();
            this.setupEventListeners();
            this.setupNavigation();
        }, 100);
    },
    
    /**
     * Load user data
     */
    loadUserData() {
        const session = Storage.load('session');
        
        if (session && session.user) {
            const user = session.user;
            
            // Avatar initials
            const avatarText = document.getElementById('avatar-text');
            if (avatarText && user.name) {
                const initials = user.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);
                avatarText.textContent = initials;
            }
            
            // User name
            const userName = document.getElementById('user-name');
            if (userName) {
                userName.textContent = user.name || 'User';
            }
            
            // User email
            const userEmail = document.getElementById('user-email');
            if (userEmail) {
                userEmail.textContent = user.email || 'email@example.com';
            }
            
            // Target exam
            const targetExam = document.getElementById('target-exam');
            if (targetExam) {
                targetExam.textContent = user.exam || 'Not set';
            }
            
            // Education level
            const educationLevel = document.getElementById('education-level');
            if (educationLevel) {
                const levelMap = {
                    'secondary': 'Secondary School',
                    'undergraduate': 'Undergraduate',
                    'postgraduate': 'Postgraduate',
                    'professional': 'Professional'
                };
                educationLevel.textContent = levelMap[user.education] || user.education || 'Not set';
            }
            
            // Member since
            const memberSince = document.getElementById('member-since');
            if (memberSince) {
                const date = new Date();
                const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                memberSince.textContent = monthYear;
            }
            
            if (CONFIG.DEBUG) {
                console.log('📋 User data loaded:', user);
            }
        }
    },
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Back button
        const backBtn = document.getElementById('profile-back');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.handleBack());
        }
        
        // Menu items
        document.getElementById('edit-profile')?.addEventListener('click', () => this.handleEditProfile());
        document.getElementById('change-password')?.addEventListener('click', () => this.handleChangePassword());
        document.getElementById('notifications')?.addEventListener('click', () => this.handleNotifications());
        document.getElementById('help-support')?.addEventListener('click', () => this.handleHelpSupport());
        document.getElementById('about-app')?.addEventListener('click', () => this.handleAbout());
        
        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
        
        if (CONFIG.DEBUG) {
            console.log('✅ Profile listeners bound');
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
     * Handle menu actions
     */
    handleEditProfile() {
        this.showToast('Edit profile coming soon!', 'info');
    },
    
    handleChangePassword() {
        this.showToast('Change password coming soon!', 'info');
    },
    
    handleNotifications() {
        this.showToast('Notification settings coming soon!', 'info');
    },
    
    handleHelpSupport() {
        this.showToast('Help & Support coming soon!', 'info');
    },
    
    handleAbout() {
        alert('ExamBolt v1.0.0\n\nYour ultimate exam preparation companion.\n\nBuilt with ❤️ by ExamBolt Team');
    },
    
    /**
     * Handle logout
     */
    async handleLogout() {
        if (confirm('Are you sure you want to log out?')) {
            if (CONFIG.DEBUG) {
                console.log('🚪 Logging out...');
            }
            
            // Clear session
            Storage.clear();
            
            // Navigate to auth
            await Router.showPage('auth');
            
            this.showToast('Logged out successfully', 'success');
        }
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
                await Router.showPage('analytics');
                break;
                
            case 'profile':
                // Already on profile
                break;
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