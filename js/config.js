// ==========================================
// EXAMBOLT - CONFIGURATION
// ==========================================

const CONFIG = {
    // API Settings
    API_BASE_URL: '/backend',  // Your PHP backend folder
    USE_MOCK_API: true,        // Set false when backend ready
    
    // Timing
    SPLASH_MIN_DURATION: 2000, // Minimum 2 seconds
    
    // Debug
    DEBUG: true,  // Console logs
};

if (CONFIG.DEBUG) {
    console.log('⚡ ExamBolt Config:', CONFIG);
}