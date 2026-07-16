// Helper function for Session Management
export const getOrCreateSessionId = () => {
    if (typeof window === 'undefined') return ''; // Safety check for SSR

    let sessionId = sessionStorage.getItem('clickstream_session_id');
    if (!sessionId) {
        // Generate a new UUID if none exists
        sessionId = crypto.randomUUID();
        sessionStorage.setItem('clickstream_session_id', sessionId);
    }
    return sessionId;
};