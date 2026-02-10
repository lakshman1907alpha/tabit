/**
 * urlUtils.js
 * 
 * Responsibility:
 * - Clean URLs (remove query params for grouping if needed)
 * - Extract hostname safely
 * - Validate protocols (http/https vs chrome://)
 */

export const UrlUtils = {
    /**
     * Extract hostname from a URL string
     * @param {string} url 
     * @returns {string} Hostname or 'unknown'
     */
    getHostname: (url) => {
        try {
            if (!url) return 'unknown';
            const urlObj = new URL(url);
            return urlObj.hostname;
        } catch (e) {
            return 'unknown';
        }
    },

    /**
     * Check if the URL is a standard web page (http/https)
     * @param {string} url 
     * @returns {boolean}
     */
    isWebPage: (url) => {
        return url && (url.startsWith('http://') || url.startsWith('https://'));
    },

    /**
     * Get a clean version of the URL for duplicate checking (strips hash, maybe params)
     * @param {string} url 
     * @returns {string}
     */
    getCleanUrl: (url) => {
        try {
            if (!url) return '';
            const urlObj = new URL(url);
            // For now, we consider the full URL significantly, but ignore hash
            return `${urlObj.origin}${urlObj.pathname}${urlObj.search}`;
        } catch (e) {
            return url;
        }
    }
};
