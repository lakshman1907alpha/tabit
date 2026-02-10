/**
 * popup/hooks/useTabStore.js
 * 
 * Responsibility:
 * - React hook to sync state with chrome.storage
 * - Listen for storage changes
 */

import { useState, useEffect, useCallback } from 'react';
import { CONSTANTS } from '../../utils/constants';

export const useTabStore = () => {
    const [data, setData] = useState({
        tabs: [],
        groups: {},
        metadata: {},
        loading: true,
        error: null
    });

    const fetchData = useCallback(async () => {
        try {
            const response = await chrome.runtime.sendMessage({
                type: CONSTANTS.MESSAGES.GET_DASHBOARD_DATA
            });

            if (response && !response.error) {
                setData({
                    tabs: response.tabs || [],
                    groups: response.groups || {},
                    metadata: response.metadata || {},
                    loading: false,
                    error: null
                });
            } else {
                setData(prev => ({ ...prev, loading: false, error: response?.error || 'Failed to fetch data' }));
            }
        } catch (err) {
            setData(prev => ({ ...prev, loading: false, error: err.message }));
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchData();

        // Listen for updates from background (optional, if we push updates)
        // Or just poll/re-fetch on focus
        const handleMessage = (message) => {
            if (message.type === CONSTANTS.MESSAGES.DATA_UPDATED) {
                fetchData();
            }
        };
        chrome.runtime.onMessage.addListener(handleMessage);
        return () => chrome.runtime.onMessage.removeListener(handleMessage);
    }, [fetchData]);

    const closeTabs = async (tabIds) => {
        try {
            await chrome.runtime.sendMessage({
                type: CONSTANTS.MESSAGES.CLOSE_TABS,
                payload: { tabIds }
            });
            // Optimistic update or refetch
            fetchData();
        } catch (err) {
            console.error("Failed to close tabs", err);
        }
    };

    return { ...data, refresh: fetchData, closeTabs };
};
