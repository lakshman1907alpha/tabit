/**
 * background/eventListeners.js
 * 
 * Responsibility:
 * - Listen for chrome.tabs.onCreated/Updated/Activated/Removed
 * - Update 'lastAccessed' timestamp in storage
 */

import { StorageService } from '../services/storageService';

// On Activated: Update timestamp for the active tab
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    try {
        await StorageService.updateTabMetadata(activeInfo.tabId, {
            lastAccessed: Date.now()
        });
    } catch (err) {
        console.error('Error in onActivated:', err);
    }
});

// On Updated: If URL changes, might want to reset score or re-evaluate
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        try {
            await StorageService.updateTabMetadata(tabId, {
                lastAccessed: Date.now(), // Consider update as an interaction
                url: tab.url,
                title: tab.title
            });
        } catch (err) {
            console.error('Error in onUpdated:', err);
        }
    }
});

// On Removed: Clean up metadata
chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
    try {
        await StorageService.removeTabMetadata(tabId);
    } catch (err) {
        console.error('Error in onRemoved:', err);
    }
});
