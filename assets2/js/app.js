// ==========================================
// EXAMBOLT - MAIN APP
// Entry point with YOUR EXACT logic
// ==========================================

const App = {
    /**
     * Initialize app
     */
    async init() {
        if (CONFIG.DEBUG) {
            console.log('⚡ ExamBolt starting...');
        }
        
        // Start with splash screen
        await this.showSplashAndCheckSession();
    },
    
    /**
     * YOUR EXACT LOGIC:
     * 1. Show splash screen
     * 2. Call API to check session
     * 3. Route based on user status
     */
    async showSplashAndCheckSession() {
        const startTime = Date.now();
        
        try {
            // 1. Show splash screen
            await Router.showPage('splash');
            
            if (CONFIG.DEBUG) {
                console.log('🌟 Splash screen displayed');
                console.log('📡 Checking session...');
            }
            
            // 2. Call API to check session (runs while splash shows)
            const sessionStatus = await API.checkSession();
            
            if (CONFIG.DEBUG) {
                console.log('✅ Session status:', sessionStatus.status);
            }
            
            // 3. Ensure minimum splash duration
            const elapsed = Date.now() - startTime;
            const remainingTime = Math.max(0, CONFIG.SPLASH_MIN_DURATION - elapsed);
            
            if (remainingTime > 0) {
                await new Promise(resolve => setTimeout(resolve, remainingTime));
            }
            
            // 4. Route based on status
            this.routeUserByStatus(sessionStatus);
            
        } catch (error) {
            console.error('❌ Splash error:', error);
            // On error, go to onboarding
            await Router.showPage('onboarding');
        }
    },
    
    /**
     * Route user based on session status
     * YOUR EXACT LOGIC:
     * - Not logged in → Onboarding
     * - Email not verified → Email Verification
     * - Profile incomplete → Profile Setup
     * - Active → Dashboard
     */
    async routeUserByStatus(sessionStatus) {
        if (CONFIG.DEBUG) {
            console.log(`🎯 Routing by status: ${sessionStatus.status}`);
        }
        
        switch (sessionStatus.status) {
            case 'not_logged_in':
                // User not logged in → Show onboarding
                await Router.showPage('onboarding');
                break;
                
            case 'email_not_verified':
                // Email not verified → Show email verification
                await Router.showPage('email-verify');
                break;
                
            case 'profile_incomplete':
                // Profile not complete → Show profile setup
                await Router.showPage('profile-setup');
                break;
                
            case 'active':
                // Everything complete → Show dashboard
                await Router.showPage('dashboard');
                break;
                
            default:
                // Unknown status → Default to onboarding
                await Router.showPage('onboarding');
        }
    }
};

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Expose for debugging
window.ExamBolt = {
    goTo: (page) => Router.showPage(page),
    clearData: () => Storage.clear(),
    
    // Test different user states
    testLoggedOut: () => {
        Storage.clear();
        location.reload();
    },
    testEmailNotVerified: () => {
        Storage.save('session', {
            token: 'test123',
            user: { emailVerified: false }
        });
        location.reload();
    },
    testProfileIncomplete: () => {
        Storage.save('session', {
            token: 'test123',
            user: { emailVerified: true, profileComplete: false }
        });
        location.reload();
    },
    testActive: () => {
        Storage.save('session', {
            token: 'test123',
            user: { emailVerified: true, profileComplete: true }
        });
        location.reload();
    }
};

if (CONFIG.DEBUG) {
    console.log('💡 Debug commands:');
    console.log('  ExamBolt.goTo("dashboard")');
    console.log('  ExamBolt.testEmailNotVerified()');
    console.log('  ExamBolt.testProfileIncomplete()');
    console.log('  ExamBolt.testActive()');
}