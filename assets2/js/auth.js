// ==========================================
// EXAMBOLT - AUTH LOGIC
// Login/Signup handling
// ==========================================

const Auth = {
    mode: 'signup', // 'login' or 'signup'
    
    /**
     * Initialize auth screen
     */
    init() {
        if (CONFIG.DEBUG) {
            console.log('🔐 Auth initialized - Mode:', this.mode);
        }
        
        setTimeout(() => {
            this.setupEventListeners();
            this.setMode('signup'); // Default to signup
        }, 100);
    },
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Auth button (Continue)
        const authBtn = document.getElementById('auth-btn');
        if (authBtn) {
            authBtn.addEventListener('click', () => this.handleSubmit());
            if (CONFIG.DEBUG) console.log('✅ Auth button bound');
        }
        
        // Toggle link (Switch between Login/Signup)
        const toggleLink = document.getElementById('toggle-link');
        if (toggleLink) {
            toggleLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMode();
            });
            if (CONFIG.DEBUG) console.log('✅ Toggle link bound');
        }
        
        // Enter key to submit
        const inputs = document.querySelectorAll('.auth-input');
        inputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSubmit();
                }
            });
        });
    },
    
    /**
     * Set auth mode (login or signup)
     */
    setMode(mode) {
        this.mode = mode;
        
        const title = document.getElementById('auth-title');
        const subtitle = document.getElementById('auth-subtitle');
        const toggleText = document.getElementById('toggle-text');
        const toggleLink = document.getElementById('toggle-link');
        const confirmGroup = document.getElementById('confirm-password-group');
        
        if (mode === 'signup') {
            title.textContent = 'Create Account';
            subtitle.textContent = 'Join ExamBolt today';
            toggleText.textContent = 'Already have an account?';
            toggleLink.textContent = 'Log In';
            confirmGroup.style.display = 'block';
        } else {
            title.textContent = 'Welcome Back';
            subtitle.textContent = 'Continue your learning journey';
            toggleText.textContent = "Don't have an account?";
            toggleLink.textContent = 'Sign Up';
            confirmGroup.style.display = 'none';
        }
        
        if (CONFIG.DEBUG) {
            console.log(`🔄 Switched to ${mode} mode`);
        }
    },
    
    /**
     * Toggle between login and signup
     */
    toggleMode() {
        const newMode = this.mode === 'login' ? 'signup' : 'login';
        this.setMode(newMode);
    },
    
    /**
     * Handle form submission
     */
    async handleSubmit() {
        const email = document.getElementById('auth-email').value.trim();
        const password = document.getElementById('auth-password').value;
        const confirmPassword = document.getElementById('auth-confirm-password').value;
        
        // Validation
        if (!email) {
            this.showError('Please enter your email or phone');
            return;
        }
        
        if (!password) {
            this.showError('Please enter your password');
            return;
        }
        
        if (this.mode === 'signup') {
            if (!confirmPassword) {
                this.showError('Please confirm your password');
                return;
            }
            
            if (password !== confirmPassword) {
                this.showError('Passwords do not match');
                return;
            }
            
            if (password.length < 6) {
                this.showError('Password must be at least 6 characters');
                return;
            }
            
            // Handle signup
            await this.handleSignup(email, password);
        } else {
            // Handle login
            await this.handleLogin(email, password);
        }
    },
    
    /**
     * Handle signup
     */
    async handleSignup(email, password) {
        if (CONFIG.DEBUG) {
            console.log('📝 Signup attempt:', email);
        }
        
        this.showLoading(true);
        
        try {
            // For now, just save to session and go to email verification
            // In real app, this would call API
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Save session (email not verified yet)
            Storage.save('session', {
                token: 'temp_token_' + Date.now(),
                user: {
                    email: email,
                    emailVerified: false,
                    profileComplete: false
                }
            });
            
            this.showLoading(false);
            
            // Go to email verification
            await Router.showPage('email-verify');
            
            this.showToast('Verification code sent!', 'success');
            
        } catch (error) {
            this.showLoading(false);
            this.showError('Signup failed. Please try again.');
            console.error('Signup error:', error);
        }
    },
    
    /**
     * Handle login
     */
    async handleLogin(email, password) {
        if (CONFIG.DEBUG) {
            console.log('🔑 Login attempt:', email);
        }
        
        this.showLoading(true);
        
        try {
            // For now, just save to session and go to dashboard
            // In real app, this would call API
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Save session (fully verified for testing)
            Storage.save('session', {
                token: 'token_' + Date.now(),
                user: {
                    email: email,
                    emailVerified: true,
                    profileComplete: true,
                    name: 'Test User'
                }
            });
            
            this.showLoading(false);
            
            // Go to dashboard
            await Router.showPage('dashboard');
            
            this.showToast('Welcome back!', 'success');
            
        } catch (error) {
            this.showLoading(false);
            this.showError('Login failed. Please try again.');
            console.error('Login error:', error);
        }
    },
    
    /**
     * Show error message
     */
    showError(message) {
        this.showToast(message, 'error');
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
    },
    
    /**
     * Show/hide loading overlay
     */
    showLoading(show) {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            if (show) {
                overlay.classList.add('active');
            } else {
                overlay.classList.remove('active');
            }
        }
    }
};