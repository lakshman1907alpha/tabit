/**
 * background/messageHandler.js
 * 
 * Responsibility:
 * - Handle messages from Popup (React)
 * - Route commands like 'CLOSE_DUPLICATES' to services
 */

import { CONSTANTS } from '../utils/constants';
import { TabService } from '../services/tabService';
import { StorageService } from '../services/storageService';
import { DuplicateService } from '../services/duplicateService';
import { ScoringService } from '../services/scoringService';
import { GroupingService } from '../services/groupingService';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    (async () => {
        try {
            switch (message.type) {
                case CONSTANTS.MESSAGES.GET_DASHBOARD_DATA:
                    const tabs = await TabService.queryAll();
                    const metadata = await StorageService.getTabMetadata();

                    // Enrich tabs with scores
                    const duplicatesMap = DuplicateService.findDuplicates(tabs);
                    // Flatten duplicated IDs for easy lookup
                    const duplicateIds = new Set();
                    duplicatesMap.forEach(ids => {
                        // Mark all but the first as duplicate for scoring purposes
                        ids.slice(1).forEach(id => duplicateIds.add(id));
                    });

                    const enrichedTabs = tabs.map(tab => {
                        const isDuplicate = duplicateIds.has(tab.id);
                        const score = ScoringService.calculateScore(tab, metadata[tab.id], isDuplicate);
                        return { ...tab, score, isDuplicate };
                    });

                    const groups = GroupingService.groupByDomain(enrichedTabs);

                    sendResponse({
                        tabs: enrichedTabs,
                        groups,
                        metadata
                    });
                    break;

                case CONSTANTS.MESSAGES.CLOSE_TABS:
                    if (message.payload && message.payload.tabIds) {
                        await TabService.closeTabs(message.payload.tabIds);
                        sendResponse({ success: true });
                    }
                    break;

                default:
                    sendResponse({ error: 'Unknown message type' });
            }
        } catch (error) {
            console.error('Message handler error:', error);
            sendResponse({ error: error.message });
        }
    })();

    return true; // Keep channel open for async response
});
