// ==========================================
// EXAMBOLT - LOCAL STORAGE
// ==========================================

const Storage = {
    // Save data
    save(key, data) {
        try {
            localStorage.setItem(`exambolt_${key}`, JSON.stringify(data));
            if (CONFIG.DEBUG) console.log('💾 Saved:', key);
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    },
    
    // Load data
    load(key) {
        try {
            const data = localStorage.getItem(`exambolt_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Storage error:', e);
            return null;
        }
    },
    
    // Remove data
    remove(key) {
        localStorage.removeItem(`exambolt_${key}`);
    },
    
    // Clear all
    clear() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('exambolt_')) {
                localStorage.removeItem(key);
            }
        });
        if (CONFIG.DEBUG) console.log('🧹 Storage cleared');
    }
};