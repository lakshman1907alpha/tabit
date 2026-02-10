/**
 * duplicateService.js
 * 
 * Responsibility:
 * - Detect exact URL duplicates
 * - Detect fuzzy matches (optional future)
 */

import { UrlUtils } from '../utils/urlUtils';

export const DuplicateService = {
    /**
     * Find duplicate tabs
     * @param {chrome.tabs.Tab[]} tabs List of tabs to check
     * @returns {Map<string, number[]>} Map of URL -> [tabIds]
     */
    findDuplicates: (tabs) => {
        const urlMap = new Map();
        const duplicates = new Map(); // URL -> [tabId, tabId]

        tabs.forEach(tab => {
            const cleanUrl = UrlUtils.getCleanUrl(tab.url);

            if (!cleanUrl || cleanUrl === 'unknown') return;

            if (urlMap.has(cleanUrl)) {
                // Found a duplicate
                const existingId = urlMap.get(cleanUrl);

                if (!duplicates.has(cleanUrl)) {
                    // First time detecting this duplicate set
                    duplicates.set(cleanUrl, [existingId, tab.id]);
                } else {
                    // Add to existing set
                    duplicates.get(cleanUrl).push(tab.id);
                }
            } else {
                urlMap.set(cleanUrl, tab.id);
            }
        });

        return duplicates;
    },

    /**
     * Get a list of IDs for all duplicates, keeping the first one open
     * @param {Map<string, number[]>} duplicateMap 
     * @returns {number[]} Array of tab IDs to close
     */
    getDuplicateIdsToClose: (duplicateMap) => {
        const idsToClose = [];
        duplicateMap.forEach((ids) => {
            // Keep the first one (usually the oldest one if sorted by ID, but simpler logic is fine)
            // ids[0] is kept, request to close ids[1..n]
            idsToClose.push(...ids.slice(1));
        });
        return idsToClose;
    }
};
