/**
 * storageService.js
 * 
 * Responsibility:
 * - Wrapper for chrome.storage.local
 * - Persist tab metadata (lastAccessed, scores)
 * - Error handling for storage limits
 */

import { CONSTANTS } from '../utils/constants';

export const StorageService = {
    /**
     * Get the entire tab metadata object
     * @returns {Promise<Object>} Map of tabId -> metadata
     */
    getTabMetadata: () => {
        return new Promise((resolve) => {
            chrome.storage.local.get([CONSTANTS.STORAGE_KEYS.TAB_METADATA], (result) => {
                resolve(result[CONSTANTS.STORAGE_KEYS.TAB_METADATA] || {});
            });
        });
    },

    /**
     * Update metadata for a specific tab
     * @param {number} tabId 
     * @param {Object} data Partial data to update
     */
    updateTabMetadata: async (tabId, data) => {
        const allData = await StorageService.getTabMetadata();
        const currentTab = allData[tabId] || {};

        const newData = {
            ...allData,
            [tabId]: { ...currentTab, ...data, lastUpdated: Date.now() }
        };

        return new Promise((resolve) => {
            chrome.storage.local.set({ [CONSTANTS.STORAGE_KEYS.TAB_METADATA]: newData }, resolve);
        });
    },

    /**
     * Remove metadata for closed tabs
     * @param {number|number[]} tabIds 
     */
    removeTabMetadata: async (tabIds) => {
        const ids = Array.isArray(tabIds) ? tabIds : [tabIds];
        const allData = await StorageService.getTabMetadata();

        let changed = false;
        ids.forEach(id => {
            if (allData[id]) {
                delete allData[id];
                changed = true;
            }
        });

        if (changed) {
            return new Promise((resolve) => {
                chrome.storage.local.set({ [CONSTANTS.STORAGE_KEYS.TAB_METADATA]: allData }, resolve);
            });
        }
    },

    /**
     * Clean up metadata for tabs that no longer exist
     * @param {number[]} activeTabIds List of currently open tab IDs
     */
    pruneStaleMetadata: async (activeTabIds) => {
        const allData = await StorageService.getTabMetadata();
        const storedIds = Object.keys(allData).map(Number);
        const activeSet = new Set(activeTabIds);

        const idsToRemove = storedIds.filter(id => !activeSet.has(id));

        if (idsToRemove.length > 0) {
            console.log(`Pruning ${idsToRemove.length} stale metadata entries.`);
            await StorageService.removeTabMetadata(idsToRemove);
        }
    }
};
