/**
 * popup/components/TabGroup.jsx
 * 
 * Responsibility:
 * - Render a cluster of tabs (e.g., by domain)
 * - Collapsible, Sticky Header
 */

import React, { useState } from 'react';
import TabItem from './TabItem';

const TabGroup = ({ domain, tabs, onCloseTab }) => {
    const [expanded, setExpanded] = useState(true);

    return (
        <div style={styles.container}>
            <div
                style={styles.header}
                onClick={() => setExpanded(!expanded)}
                className="clickable"
            >
                <div style={styles.headerLeft}>
                    <span style={styles.chevron}>{expanded ? '▼' : '▶'}</span>
                    <span style={styles.domain}>{domain || 'Unknown'}</span>
                </div>
                <span style={styles.count}>{tabs.length}</span>
            </div>

            {expanded && (
                <div style={styles.list}>
                    {tabs.map(tab => (
                        <TabItem key={tab.id} tab={tab} onClose={onCloseTab} />
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        background: 'var(--bg-secondary)',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        marginBottom: '8px'
    },
    header: {
        padding: '12px 16px',
        background: 'var(--bg-secondary)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        userSelect: 'none',
        borderBottom: '1px solid transparent' // Placeholder for expansion
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    chevron: {
        fontSize: '10px',
        color: 'var(--text-secondary)',
        width: '12px'
    },
    domain: {
        fontWeight: '600',
        fontSize: '13px',
        color: 'var(--text-primary)'
    },
    count: {
        background: 'rgba(255,255,255, 0.1)',
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '11px',
        color: 'var(--text-secondary)',
        fontWeight: '500'
    },
    list: {
        borderTop: '1px solid var(--border-color)',
    }
};

export default TabGroup;
