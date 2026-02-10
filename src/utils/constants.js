/**
 * constants.js
 * 
 * Responsibility:
 * - Define system-wide constants
 * - Thresholds for inactivity
 * - Message types for communication
 */

export const CONSTANTS = {
    // Time thresholds (in milliseconds)
    INACTIVITY_THRESHOLD: 1000 * 60 * 60, // 1 hour
    STALE_THRESHOLD: 1000 * 60 * 60 * 24, // 24 hours

    // Storage keys
    STORAGE_KEYS: {
        TAB_METADATA: 'tab_metadata', // Stores lastAccess, etc.
        USER_PREFS: 'user_prefs'
    },

    // Message Types
    MESSAGES: {
        GET_DASHBOARD_DATA: 'GET_DASHBOARD_DATA',
        CLOSE_TABS: 'CLOSE_TABS',
        GROUP_TABS: 'GROUP_TABS',
        DATA_UPDATED: 'DATA_UPDATED' // Event sent to popup
    },

    // Scoring Weights
    SCORING: {
        DUPLICATE_WEIGHT: 100,
        INACTIVE_WEIGHT: 50,
        STALE_WEIGHT: 80
    }
};
