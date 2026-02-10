/**
 * scoringService.js
 * 
 * Responsibility:
 * - Calculate 'Safe to Close' score (0-100)
 * - Input: Inactivity time, duplication status, matching patterns
 */

import { CONSTANTS } from '../utils/constants';
import { DateUtils } from '../utils/dateUtils';

export const ScoringService = {
    /**
     * Calculate a score for a tab
     * Higher score = Safer to close
     * @param {chrome.tabs.Tab} tab 
     * @param {Object} metadata (lastAccessed, etc)
     * @param {boolean} isDuplicate
     * @returns {number} Score 0-100
     */
    calculateScore: (tab, metadata, isDuplicate) => {
        let score = 0;

        // 1. Duplicates are very safe to close
        if (isDuplicate) {
            score += CONSTANTS.SCORING.DUPLICATE_WEIGHT;
        }

        // 2. Inactivity
        // If we have metadata, use it. usage of 'lastAccessed'.
        // If not, we might rely on other heuristics or it's a new tab (score 0)
        const lastAccessed = metadata?.lastAccessed;

        if (lastAccessed) {
            const timeSince = DateUtils.timeSince(lastAccessed);

            if (timeSince > CONSTANTS.STALE_THRESHOLD) {
                score += CONSTANTS.SCORING.STALE_WEIGHT;
            } else if (timeSince > CONSTANTS.INACTIVITY_THRESHOLD) {
                score += CONSTANTS.SCORING.INACTIVE_WEIGHT;
            }
        }

        // 3. Pinned tabs are protected (score -100 or just 0 cap)
        if (tab.pinned) {
            return 0;
        }

        // 4. Audio playing tabs are protected
        if (tab.audible) {
            return 0;
        }

        return Math.min(score, 100);
    }
};
