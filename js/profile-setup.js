// ==========================================
// EXAMBOLT - PROFILE SETUP LOGIC
// Form validation & progress tracking
// ==========================================

const ProfileSetup = {
    requiredFields: ['setup-name', 'setup-education', 'setup-exam'],
    
    /**
     * Initialize profile setup screen
     */
    init() {
        if (CONFIG.DEBUG) {
            console.log('👤 Profile setup initialized');
        }
        
        setTimeout(() => {
            this.setupEventListeners();
            this.updateProgress();
        }, 100);
    },
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Setup button
        const setupBtn = document.getElementById('setup-btn');
        if (setupBtn) {
            setupBtn.addEventListener('click', () => this.handleSubmit());
            if (CONFIG.DEBUG) console.log('✅ Setup button bound');
        }
        
        // All inputs - update progress on change
        const inputs = document.querySelectorAll('.setup-input');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.updateProgress());
            input.addEventListener('change', () => this.updateProgress());
            
            // Enter key to submit
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSubmit();
                }
            });
        });
        
        if (CONFIG.DEBUG) {
            console.log(`✅ ${inputs.length} inputs configured`);
        }
    },
    
    /**
     * Update progress bar
     */
    updateProgress() {
        const name = document.getElementById('setup-name').value.trim();
        const education = document.getElementById('setup-education').value;
        const exam = document.getElementById('setup-exam').value.trim();
        const subjects = document.getElementById('setup-subjects').value.trim();
        const examDate = document.getElementById('setup-exam-date').value;
        
        let filled = 0;
        const total = 5; // Total fields
        
        if (name) filled++;
        if (education) filled++;
        if (exam) filled++;
        if (subjects) filled++;
        if (examDate) filled++;
        
        const percentage = Math.round((filled / total) * 100);
        
        // Update progress bar
        const progressFill = document.getElementById('setup-progress');
        const progressText = document.getElementById('progress-text');
        
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${percentage}% Complete`;
        }
        
        // Visual feedback on required fields
        this.requiredFields.forEach(fieldId => {
            const input = document.getElementById(fieldId);
            if (input && input.value.trim()) {
                input.classList.remove('error');
                input.classList.add('success');
            } else if (input) {
                input.classList.remove('success', 'error');
            }
        });
    },
    
    /**
     * Validate form
     */
    validate() {
        let isValid = true;
        const errors = [];
        
        // Name validation
        const name = document.getElementById('setup-name').value.trim();
        if (!name) {
            errors.push('Please enter your full name');
            document.getElementById('setup-name').classList.add('error');
            isValid = false;
        } else if (name.length < 3) {
            errors.push('Name must be at least 3 characters');
            document.getElementById('setup-name').classList.add('error');
            isValid = false;
        }
        
        // Education validation
        const education = document.getElementById('setup-education').value;
        if (!education) {
            errors.push('Please select your education level');
            document.getElementById('setup-education').classList.add('error');
            isValid = false;
        }
        
        // Exam validation
        const exam = document.getElementById('setup-exam').value.trim();
        if (!exam) {
            errors.push('Please enter your target exam');
            document.getElementById('setup-exam').classList.add('error');
            isValid = false;
        }
        
        // Show first error
        if (!isValid && errors.length > 0) {
            this.showToast(errors[0], 'error');
        }
        
        return isValid;
    },
    
    /**
     * Handle form submission
     */
    async handleSubmit() {
        // Clear previous errors
        document.querySelectorAll('.setup-input').forEach(input => {
            input.classList.remove('error');
        });
        
        // Validate
        if (!this.validate()) {
            return;
        }
        
        // Get form data
        const formData = {
            name: document.getElementById('setup-name').value.trim(),
            education: document.getElementById('setup-education').value,
            exam: document.getElementById('setup-exam').value.trim(),
            subjects: document.getElementById('setup-subjects').value.trim(),
            examDate: document.getElementById('setup-exam-date').value
        };
        
        if (CONFIG.DEBUG) {
            console.log('📝 Submitting profile:', formData);
        }
        
        const setupBtn = document.getElementById('setup-btn');
        setupBtn.classList.add('loading');
        setupBtn.disabled = true;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Update session
            const session = Storage.load('session');
            if (session) {
                session.user = {
                    ...session.user,
                    ...formData,
                    profileComplete: true
                };
                Storage.save('session', session);
            }
            
            this.showToast('Profile completed!', 'success');
            
            // Go to dashboard
            setTimeout(async () => {
                await Router.showPage('dashboard');
            }, 800);
            
        } catch (error) {
            console.error('Profile setup error:', error);
            this.showToast('Failed to save profile. Please try again.', 'error');
        } finally {
            setupBtn.classList.remove('loading');
            setupBtn.disabled = false;
        }
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