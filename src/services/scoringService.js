/**
 * scoringService.js
 * 
 * Responsibility:
 * - Calculate 'Vitality Score' (0-100) using Exponential Decay and Context Rules
 * - Input: Inactivity time, url context, tab state
 */

import { DateUtils } from '../utils/dateUtils';

const CONTEXT_HALF_LIVES = {
    // Fast decay for news/social (30 minutes)
    FAST: 30 * 60 * 1000,
    // Slow decay for productivity (12 hours)
    SLOW: 12 * 60 * 60 * 1000,
    // Default decay (2 hours)
    DEFAULT: 2 * 60 * 60 * 1000
};

const DOMAIN_CONTEXTS = {
    'cnn.com': 'FAST',
    'nytimes.com': 'FAST',
    'reddit.com': 'FAST',
    'twitter.com': 'FAST',
    'facebook.com': 'FAST',
    'docs.google.com': 'SLOW',
    'github.com': 'SLOW',
    'figma.com': 'SLOW',
    'notion.so': 'SLOW',
    'jira.com': 'SLOW'
};

export const ScoringService = {
    /**
     * Get the Vitality Score for a tab (0-100).
     * 100 = fully alive (don't suspend)
     * < 20 = candidate for suspension
     * 0 = candidate for closing
     * 
     * @param {chrome.tabs.Tab} tab 
     * @param {Object} metadata (lastAccessed)
     * @returns {number} Score 0-100
     */
    getVitalityScore: (tab, metadata) => {
        // Immunity Rules
        if (tab.pinned || tab.audible || tab.active) {
            return 100;
        }

        const lastAccessed = metadata?.lastAccessed;
        if (!lastAccessed) {
            // New tabs or tabs without metadata start at 100
            return 100;
        }

        const timeSince = DateUtils.timeSince(lastAccessed);
        
        // Determine Context Half-Life
        let halfLife = CONTEXT_HALF_LIVES.DEFAULT;
        if (tab.url) {
            try {
                const urlObj = new URL(tab.url);
                const hostname = urlObj.hostname.replace(/^www\./, '');
                
                // Check if hostname matches any known context domains
                const matchedDomain = Object.keys(DOMAIN_CONTEXTS).find(d => hostname.includes(d));
                if (matchedDomain) {
                    halfLife = CONTEXT_HALF_LIVES[DOMAIN_CONTEXTS[matchedDomain]];
                }
            } catch (e) {
                // Invalid URL (e.g., chrome://) stays default or we can make them immune
                if (tab.url.startsWith('chrome://')) return 100;
            }
        }

        // Exponential Decay: N(t) = N0 * (1/2)^(t/t_half)
        // We use Math.pow(0.5, timeSince / halfLife)
        const decayFactor = Math.pow(0.5, timeSince / halfLife);
        let score = 100 * decayFactor;

        return Math.max(0, Math.round(score));
    }
};
