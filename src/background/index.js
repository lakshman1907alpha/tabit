/**
 * background/index.js
 * 
 * Responsibility:
 * - Extension entry point
 * - Initialize listeners
 * - Setup storage on install
 */

import './eventListeners';
import './messageHandler';
import { TabService } from '../services/tabService';
import { StorageService } from '../services/storageService';

// Initialize on install or startup
chrome.runtime.onInstalled.addListener(async () => {
    console.log('Smart Tab Optimizer: Installed');
    const tabs = await TabService.queryAll();
    const activeIds = tabs.map(t => t.id);
    await StorageService.pruneStaleMetadata(activeIds);
});

console.log('Smart Tab Optimizer: Background Service Worker Initialized');
