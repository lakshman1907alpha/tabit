/**
 * tabService.js
 * 
 * Responsibility:
 * - Facade for chrome.tabs API
 * - Querying, closing, and focusing tabs
 * - Abstracting chrome.runtime.lastError checks
 */

export const TabService = {
    /**
     * Get all tabs in the current window
     * @returns {Promise<chrome.tabs.Tab[]>}
     */
    queryAll: () => {
        return new Promise((resolve) => {
            chrome.tabs.query({ currentWindow: true }, (tabs) => {
                resolve(tabs || []);
            });
        });
    },

    /**
     * Close a list of tabs
     * @param {number|number[]} tabIds 
     * @returns {Promise<void>}
     */
    closeTabs: (tabIds) => {
        const ids = Array.isArray(tabIds) ? tabIds : [tabIds];
        return new Promise((resolve) => {
            chrome.tabs.remove(ids, () => {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                }
                resolve();
            });
        });
    },

    /**
     * Focus a specific tab
     * @param {number} tabId 
     */
    focusTab: (tabId) => {
        chrome.tabs.update(tabId, { active: true });
    }
};
