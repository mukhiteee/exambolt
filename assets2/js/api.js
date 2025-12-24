// ==========================================
// EXAMBOLT - API CLIENT
// Handles all backend communication
// ==========================================

const API = {
    /**
     * Check user session status
     * Returns: 'not_logged_in' | 'email_not_verified' | 'profile_incomplete' | 'active'
     */
    async checkSession() {
        if (CONFIG.USE_MOCK_API) {
            return this.mockCheckSession();
        }
        
        try {
            const session = Storage.load('session');
            
            const response = await fetch(`${CONFIG.API_BASE_URL}/check_session.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: session?.token
                })
            });
            
            return await response.json();
        } catch (error) {
            console.error('❌ API Error:', error);
            return { status: 'error' };
        }
    },
    
    /**
     * Mock API for testing (remove when backend ready)
     */
    async mockCheckSession() {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const session = Storage.load('session');
        
        if (CONFIG.DEBUG) {
            console.log('🎭 Mock API - Session check');
        }
        
        // No session = not logged in
        if (!session || !session.token) {
            return { status: 'not_logged_in' };
        }
        
        // Check if email verified
        if (!session.user.emailVerified) {
            return { 
                status: 'email_not_verified',
                user: session.user 
            };
        }
        
        // Check if profile complete
        if (!session.user.profileComplete) {
            return { 
                status: 'profile_incomplete',
                user: session.user 
            };
        }
        
        // Everything complete = active user
        return { 
            status: 'active',
            user: session.user 
        };
    }
};