// ==========================================
// EXAMBOLT - EMAIL VERIFICATION LOGIC
// Smart OTP input handling
// ==========================================

const EmailVerify = {
    otpInputs: [],
    
    /**
     * Initialize email verification screen
     */
    init() {
        if (CONFIG.DEBUG) {
            console.log('📧 Email verification initialized');
        }
        
        setTimeout(() => {
            this.setupOTPInputs();
            this.setupEventListeners();
            this.displayEmail();
        }, 100);
    },
    
    /**
     * Display user's email
     */
    displayEmail() {
        const emailDisplay = document.getElementById('verify-email');
        const session = Storage.load('session');
        
        if (session && session.user && session.user.email) {
            emailDisplay.textContent = session.user.email;
        }
    },
    
    /**
     * Setup OTP inputs with smart behavior
     */
    setupOTPInputs() {
        this.otpInputs = document.querySelectorAll('.otp-input');
        
        if (this.otpInputs.length === 0) {
            console.error('❌ OTP inputs not found');
            return;
        }
        
        this.otpInputs.forEach((input, index) => {
            // Input event - move to next
            input.addEventListener('input', (e) => this.handleInput(e, index));
            
            // Keydown event - handle backspace
            input.addEventListener('keydown', (e) => this.handleKeyDown(e, index));
            
            // Paste event - handle full code paste
            input.addEventListener('paste', (e) => this.handlePaste(e));
            
            // Focus event - select all
            input.addEventListener('focus', (e) => e.target.select());
        });
        
        // Auto-focus first input
        this.otpInputs[0].focus();
        
        if (CONFIG.DEBUG) {
            console.log('✅ OTP inputs configured');
        }
    },
    
    /**
     * Handle input in OTP field
     */
    handleInput(e, index) {
        const input = e.target;
        const value = input.value;
        
        // Only allow numbers
        if (!/^\d*$/.test(value)) {
            input.value = '';
            return;
        }
        
        // Add filled class
        if (value) {
            input.classList.add('filled');
            input.classList.remove('error');
        } else {
            input.classList.remove('filled');
        }
        
        // Move to next input
        if (value.length === 1 && index < this.otpInputs.length - 1) {
            this.otpInputs[index + 1].focus();
        }
        
        // Auto-submit if all filled
        if (this.isComplete()) {
            setTimeout(() => this.handleVerify(), 300);
        }
    },
    
    /**
     * Handle keydown (backspace)
     */
    handleKeyDown(e, index) {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            // Move to previous input on backspace
            this.otpInputs[index - 1].focus();
            this.otpInputs[index - 1].value = '';
            this.otpInputs[index - 1].classList.remove('filled');
        }
    },
    
    /**
     * Handle paste (full code)
     */
    handlePaste(e) {
        e.preventDefault();
        
        const pastedData = e.clipboardData.getData('text');
        const digits = pastedData.match(/\d/g);
        
        if (!digits) return;
        
        // Fill inputs with pasted digits
        digits.slice(0, 4).forEach((digit, index) => {
            if (this.otpInputs[index]) {
                this.otpInputs[index].value = digit;
                this.otpInputs[index].classList.add('filled');
            }
        });
        
        // Focus last filled input
        const lastIndex = Math.min(digits.length, 4) - 1;
        this.otpInputs[lastIndex].focus();
        
        // Auto-submit if complete
        if (this.isComplete()) {
            setTimeout(() => this.handleVerify(), 300);
        }
    },
    
    /**
     * Check if all inputs are filled
     */
    isComplete() {
        return Array.from(this.otpInputs).every(input => input.value.length === 1);
    },
    
    /**
     * Get OTP code
     */
    getCode() {
        return Array.from(this.otpInputs).map(input => input.value).join('');
    },
    
    /**
     * Clear all inputs
     */
    clearInputs() {
        this.otpInputs.forEach(input => {
            input.value = '';
            input.classList.remove('filled', 'error');
        });
        this.otpInputs[0].focus();
    },
    
    /**
     * Show error on inputs
     */
    showError() {
        this.otpInputs.forEach(input => {
            input.classList.add('error');
        });
        
        setTimeout(() => {
            this.otpInputs.forEach(input => {
                input.classList.remove('error');
            });
        }, 400);
    },
    
    /**
     * Setup other event listeners
     */
    setupEventListeners() {
        // Verify button
        const verifyBtn = document.getElementById('verify-btn');
        if (verifyBtn) {
            verifyBtn.addEventListener('click', () => this.handleVerify());
            if (CONFIG.DEBUG) console.log('✅ Verify button bound');
        }
        
        // Resend code
        const resendLink = document.getElementById('resend-code');
        if (resendLink) {
            resendLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleResend();
            });
        }
        
        // Change email
        const changeLink = document.getElementById('change-email');
        if (changeLink) {
            changeLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleChangeEmail();
            });
        }
    },
    
    /**
     * Handle verification
     */
    async handleVerify() {
        const code = this.getCode();
        
        if (code.length !== 4) {
            this.showToast('Please enter the 4-digit code', 'error');
            return;
        }
        
        if (CONFIG.DEBUG) {
            console.log('🔐 Verifying code:', code);
        }
        
        const verifyBtn = document.getElementById('verify-btn');
        verifyBtn.classList.add('loading');
        verifyBtn.disabled = true;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // For testing, accept any 4-digit code
            // In real app, this would verify with backend
            
            // Update session
            const session = Storage.load('session');
            if (session) {
                session.user.emailVerified = true;
                Storage.save('session', session);
            }
            
            this.showToast('Email verified!', 'success');
            
            // Go to profile setup
            setTimeout(async () => {
                await Router.showPage('profile-setup');
            }, 800);
            
        } catch (error) {
            console.error('Verification error:', error);
            this.showToast('Invalid code. Please try again.', 'error');
            this.showError();
            this.clearInputs();
        } finally {
            verifyBtn.classList.remove('loading');
            verifyBtn.disabled = false;
        }
    },
    
    /**
     * Handle resend code
     */
    async handleResend() {
        if (CONFIG.DEBUG) {
            console.log('📤 Resending code...');
        }
        
        this.showToast('New code sent!', 'success');
        this.clearInputs();
        
        // In real app, would call API to resend
    },
    
    /**
     * Handle change email
     */
    async handleChangeEmail() {
        // Clear session and go back to auth
        Storage.remove('session');
        await Router.showPage('auth');
        this.showToast('Please sign up again', 'info');
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
};