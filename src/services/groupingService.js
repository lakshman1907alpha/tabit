/**
 * groupingService.js
 * 
 * Responsibility:
 * - Group tabs by domain or logical context
 * - Return structured data for UI rendering
 */

import { UrlUtils } from '../utils/urlUtils';

export const GroupingService = {
    /**
     * Group tabs by their hostname
     * @param {chrome.tabs.Tab[]} tabs 
     * @returns {Object} Map of hostname -> [tabs]
     */
    groupByDomain: (tabs) => {
        const groups = {};

        tabs.forEach(tab => {
            const hostname = UrlUtils.getHostname(tab.url);

            if (!groups[hostname]) {
                groups[hostname] = [];
            }

            groups[hostname].push(tab);
        });

        return groups;
    }
};
