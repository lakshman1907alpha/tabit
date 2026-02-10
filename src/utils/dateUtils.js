/**
 * dateUtils.js
 * 
 * Responsibility:
 * - Format "X mins ago"
 * - Calculate time difference between Date.now() and lastAccessed
 */

export const DateUtils = {
    /**
     * Returns milliseconds elapsed since the given date
     * @param {number} timestamp 
     * @returns {number}
     */
    timeSince: (timestamp) => {
        if (!timestamp) return 0;
        return Date.now() - timestamp;
    },

    /**
     * Human readable duration string
     * @param {number} timestamp 
     * @returns {string} e.g. "5 mins ago"
     */
    formatDuration: (timestamp) => {
        if (!timestamp) return 'Just now';

        const diff = Date.now() - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'Just now';
    }
};
