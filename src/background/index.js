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
import { SuspensionService } from '../services/suspensionService';

const DECAY_ALARM_NAME = 'run-tab-decay';

// Initialize on install or startup
chrome.runtime.onInstalled.addListener(async () => {
    console.log('Smart Tab Optimizer: Installed');
    const tabs = await TabService.queryAll();
    const activeIds = tabs.map(t => t.id);
    await StorageService.pruneStaleMetadata(activeIds);

    // Seed metadata for existing tabs so scoring works immediately
    for (const tab of tabs) {
        if (tab.lastAccessed) {
            await StorageService.updateTabMetadata(tab.id, {
                lastAccessed: tab.lastAccessed,
                url: tab.url,
                title: tab.title
            });
        }
    }

    // Setup periodic alarm (runs every 5 minutes)
    chrome.alarms.create(DECAY_ALARM_NAME, { periodInMinutes: 5 });
});

// Listen for alarms
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === DECAY_ALARM_NAME) {
        SuspensionService.runDecayAlgorithm();
    }
});

console.log('Smart Tab Optimizer: Background Service Worker Initialized');
