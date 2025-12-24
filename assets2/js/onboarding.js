// ==========================================
// EXAMBOLT - ONBOARDING LOGIC
// Slide navigation, skip, swipe support
// ==========================================

const Onboarding = {
    currentSlide: 0,
    totalSlides: 4,
    
    /**
     * Initialize onboarding
     */
    init() {
        if (CONFIG.DEBUG) {
            console.log('📖 Onboarding initialized');
        }
        
        // Small delay to ensure DOM is ready
        setTimeout(() => {
            this.setupEventListeners();
            this.setupSwipeSupport();
        }, 100);
    },
    
    /**
     * Setup button event listeners
     */
    setupEventListeners() {
        // Next button
        const nextBtn = document.getElementById('next-btn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
            if (CONFIG.DEBUG) console.log('✅ Next button bound');
        }
        
        // Skip button
        const skipBtn = document.getElementById('skip-btn');
        if (skipBtn) {
            skipBtn.addEventListener('click', () => this.skip());
            if (CONFIG.DEBUG) console.log('✅ Skip button bound');
        }
        
        // Dots navigation
        const dots = document.querySelectorAll('.dot');
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.goToSlide(index);
            });
        });
        if (CONFIG.DEBUG) console.log(`✅ ${dots.length} dots bound`);
    },
    
    /**
     * Next slide
     */
    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.goToSlide(this.currentSlide + 1);
        } else {
            // Last slide - complete onboarding
            this.complete();
        }
    },
    
    /**
     * Previous slide
     */
    prevSlide() {
        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1);
        }
    },
    
    /**
     * Go to specific slide
     */
    goToSlide(index) {
        if (index === this.currentSlide) return;
        
        const slides = document.querySelectorAll('.onboarding-slide');
        const dots = document.querySelectorAll('.dot');
        const nextBtn = document.getElementById('next-btn');
        
        // Update current slide
        slides[this.currentSlide].classList.remove('active');
        slides[this.currentSlide].classList.add('prev');
        
        // Show new slide
        slides[index].classList.remove('prev');
        slides[index].classList.add('active');
        
        // Update dots
        dots[this.currentSlide].classList.remove('active');
        dots[index].classList.add('active');
        
        // Update current slide index
        this.currentSlide = index;
        
        // Update button text on last slide
        if (this.currentSlide === this.totalSlides - 1) {
            nextBtn.textContent = 'Get Started';
        } else {
            nextBtn.textContent = 'Next';
        }
        
        if (CONFIG.DEBUG) {
            console.log(`📄 Slide ${this.currentSlide + 1}/${this.totalSlides}`);
        }
    },
    
    /**
     * Skip onboarding
     */
    skip() {
        if (CONFIG.DEBUG) {
            console.log('⏭️ Onboarding skipped');
        }
        this.complete();
    },
    
    /**
     * Complete onboarding
     */
    async complete() {
        if (CONFIG.DEBUG) {
            console.log('✅ Onboarding completed');
        }
        
        // Mark as seen
        Storage.save('onboarding_seen', true);
        
        // Navigate to auth screen
        await Router.showPage('auth');
    },
    
    /**
     * Setup swipe support for mobile
     */
    setupSwipeSupport() {
        const slidesWrapper = document.querySelector('.slides-wrapper');
        if (!slidesWrapper) return;
        
        let touchStartX = 0;
        let touchEndX = 0;
        
        slidesWrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        slidesWrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });
    },
    
    /**
     * Handle swipe gesture
     */
    handleSwipe(startX, endX) {
        const diff = startX - endX;
        const threshold = 50; // Minimum swipe distance
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swipe left - next slide
                this.nextSlide();
            } else {
                // Swipe right - previous slide
                this.prevSlide();
            }
        }
    }
};