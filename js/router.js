// ==========================================
// EXAMBOLT - ROUTER
// Handles page navigation & loading
// ==========================================

const Router = {
    currentPage: null,
    currentCSS: null,
    
    /**
     * Load and show a page (SMOOTH, NO RELOAD!)
     */
    async showPage(pageName) {
        if (CONFIG.DEBUG) {
            console.log(`🧭 Navigating to: ${pageName}`);
        }
        
        try {
            // 1. Fade out current page
            await this.fadeOutCurrentPage();
            
            // 2. Load new page HTML
            const html = await this.loadPageHTML(pageName);
            
            // 3. Inject into app
            document.getElementById('app').innerHTML = html;
            
            // 4. Load page-specific CSS
            await this.loadPageCSS(pageName);
            
            // 5. Fade in new page
            this.fadeInPage();
            
            // 6. Initialize page-specific JavaScript
            this.initPageScript(pageName);
            
            // 7. Update current page
            this.currentPage = pageName;
            
        } catch (error) {
            console.error('❌ Router error:', error);
        }
    },
    
    /**
     * Initialize page-specific JavaScript
     */
    initPageScript(pageName) {
        // Call page-specific init function if it exists
        if (pageName === 'onboarding' && typeof Onboarding !== 'undefined') {
            Onboarding.init();
        }
        
        if (pageName === 'auth' && typeof Auth !== 'undefined') {
            Auth.init();
        }
        
        if (pageName === 'email-verify' && typeof EmailVerify !== 'undefined') {
            EmailVerify.init();
        }
        
        if (pageName === 'profile-setup' && typeof ProfileSetup !== 'undefined') {
            ProfileSetup.init();
        }
        
        if (pageName === 'dashboard' && typeof Dashboard !== 'undefined') {
            Dashboard.init();
        }
        
        if (pageName === 'study' && typeof Study !== 'undefined') {
            Study.init();
        }
        
        if (pageName === 'quiz' && typeof Quiz !== 'undefined') {
            Quiz.init();
        }
        
        if (pageName === 'analytics' && typeof Analytics !== 'undefined') {
            Analytics.init();
        }
        
        if (pageName === 'profile' && typeof Profile !== 'undefined') {
            Profile.init();
        }
        
        if (CONFIG.DEBUG) {
            console.log(`🎯 Initialized ${pageName} script`);
        }
    },
    
    /**
     * Load page HTML from /pages folder
     */
    async loadPageHTML(pageName) {
        const response = await fetch(`pages/${pageName}.html`);
        if (!response.ok) throw new Error(`Failed to load ${pageName}.html`);
        return await response.text();
    },
    
    /**
     * Load page-specific CSS dynamically
     */
    async loadPageCSS(pageName) {
        // Remove previous page CSS
        if (this.currentCSS) {
            this.currentCSS.remove();
        }
        
        // Create new link element
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `css/${pageName}.css`;
        link.id = 'page-css';
        
        // Add to head
        document.head.appendChild(link);
        this.currentCSS = link;
        
        // Wait for CSS to load
        return new Promise((resolve) => {
            link.onload = resolve;
            link.onerror = resolve; // Continue even if CSS fails
        });
    },
    
    /**
     * Fade out current page smoothly
     */
    fadeOutCurrentPage() {
        return new Promise((resolve) => {
            const currentPage = document.querySelector('.page.active');
            
            if (!currentPage) {
                resolve();
                return;
            }
            
            currentPage.classList.add('fade-out');
            
            setTimeout(() => {
                currentPage.classList.remove('active', 'fade-out');
                resolve();
            }, 300);
        });
    },
    
    /**
     * Fade in new page
     */
    fadeInPage() {
        setTimeout(() => {
            const newPage = document.querySelector('.page');
            if (newPage) {
                newPage.classList.add('active');
            }
        }, 50);
    }
};