/**
 * suspensionService.js
 * 
 * Responsibility:
 * - Executes the Tab Decay Algorithm
 * - Evaluates vitality scores for all tabs
 * - Suspends tabs below threshold
 * - Bookmarks and closes tabs that hit zero vitality
 */

import { TabService } from './tabService';
import { StorageService } from './storageService';
import { ScoringService } from './scoringService';

const SUSPENSION_THRESHOLD = 20;
const CLOSE_THRESHOLD = 0;
const READ_LATER_FOLDER_NAME = 'Tabit: Read Later';

export const SuspensionService = {
    /**
     * Run the Tab Decay algorithm on all tabs
     */
    runDecayAlgorithm: async () => {
        console.log('Smart Tab Optimizer: Running Tab Decay Algorithm...');
        const tabs = await TabService.queryAll();
        const metadataMap = await StorageService.getTabMetadata();

        for (const tab of tabs) {
            // Protect active tab, audible tabs, and pinned tabs at the highest level
            if (tab.active || tab.audible || tab.pinned) continue;

            // Only act on normal web pages (ignore chrome:// and empty urls)
            if (!tab.url || tab.url.startsWith('chrome://')) continue;

            // Skip tabs that are already discarded (suspended)
            // But we still evaluate them for CLOSE_THRESHOLD
            
            const metadata = metadataMap[tab.id];
            const score = ScoringService.getVitalityScore(tab, metadata);

            if (score <= CLOSE_THRESHOLD) {
                console.log(`Vitality Score 0. Moving tab [${tab.title}] to Read Later and closing.`);
                await SuspensionService.saveToReadLaterAndClose(tab);
            } else if (score <= SUSPENSION_THRESHOLD && !tab.discarded) {
                console.log(`Vitality Score ${score}. Suspending tab [${tab.title}].`);
                try {
                    // chrome.tabs.discard unloads the page from memory
                    chrome.tabs.discard(tab.id);
                } catch (e) {
                    console.error('Failed to discard tab:', e);
                }
            }
        }
    },


    saveToReadLaterAndClose: async (tab) => {
        try {
            // 1. Find or create the bookmark folder
            let folderId;
            const searchResults = await new Promise(resolve => {
                chrome.bookmarks.search({ title: READ_LATER_FOLDER_NAME }, resolve);
            });

            if (searchResults && searchResults.length > 0) {
                folderId = searchResults[0].id;
            } else {
                const folder = await new Promise(resolve => {
                    chrome.bookmarks.create({ title: READ_LATER_FOLDER_NAME }, resolve);
                });
                folderId = folder.id;
            }

            // 2. Add bookmark
            await new Promise(resolve => {
                chrome.bookmarks.create({
                    parentId: folderId,
                    title: tab.title,
                    url: tab.url
                }, resolve);
            });

            // 3. Close the tab
            await TabService.closeTabs(tab.id);
            console.log(`Successfully saved and closed: ${tab.title}`);
            
            // Note: TabService.closeTabs already handles storage cleanup via onRemoved listener
        } catch (error) {
            console.error('Error saving tab to read later:', error);
        }
    }
};
