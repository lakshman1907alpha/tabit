/**
 * popup/components/Dashboard.jsx
 * 
 * Responsibility:
 * - Main view container
 * - Render StatsWidget (Cards) and TabGroups
 */

import React from 'react';
import { useTabStore } from '../hooks/useTabStore';
import TabGroup from './TabGroup';

const Dashboard = () => {
    const { tabs, groups, loading, error, closeTabs } = useTabStore();

    if (loading) return <div style={styles.loading}>Loading tabs...</div>;
    if (error) return <div style={styles.error}>Error: {error}</div>;

    const totalTabs = tabs.length;
    const duplicateCount = tabs.filter(t => t.isDuplicate).length;
    // Calculate a mock "Health Score" for the dashboard
    const healthScore = Math.max(0, 100 - (duplicateCount * 5));

    return (
        <div style={styles.container}>
            {/* Stats Cards */}
            <div style={styles.statsGrid}>
                <div style={styles.card}>
                    <div style={styles.cardLabel}>Open Tabs</div>
                    <div style={styles.cardValue}>{totalTabs}</div>
                </div>
                <div style={{ ...styles.card, ...(duplicateCount > 0 ? styles.cardWarning : {}) }}>
                    <div style={styles.cardLabel}>Duplicates</div>
                    <div style={styles.cardValue}>{duplicateCount}</div>
                </div>
                <div style={styles.card}>
                    <div style={styles.cardLabel}>Health</div>
                    <div style={styles.cardValue}>{healthScore}%</div>
                </div>
            </div>

            {/* Groups List */}
            <div style={styles.groupsSection}>
                <h2 style={styles.sectionTitle}>Tab Groups</h2>
                {Object.keys(groups).length === 0 ? (
                    <div style={styles.emptyState}>No tabs open</div>
                ) : (
                    Object.keys(groups).map(domain => (
                        <TabGroup
                            key={domain}
                            domain={domain}
                            tabs={groups[domain]}
                            onCloseTab={closeTabs}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
    },
    loading: {
        padding: '40px',
        textAlign: 'center',
        color: 'var(--text-secondary)'
    },
    error: {
        padding: '20px',
        color: 'var(--danger-color)',
        border: '1px solid var(--danger-color)',
        borderRadius: '6px'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px'
    },
    card: {
        background: 'var(--bg-primary)',
        padding: '16px',
        borderRadius: '6px',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    cardWarning: {
        borderColor: 'var(--danger-color)',
        background: '#fff5f5'
    },
    cardLabel: {
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        color: 'var(--text-secondary)',
        marginBottom: '4px'
    },
    cardValue: {
        fontSize: '20px',
        fontWeight: '600',
        color: 'var(--accent-primary)'
    },
    groupsSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    sectionTitle: {
        fontSize: '14px',
        fontWeight: '600',
        color: 'var(--text-secondary)',
        margin: 0,
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    emptyState: {
        textAlign: 'center',
        padding: '40px',
        color: 'var(--text-secondary)',
        background: 'var(--bg-secondary)',
        borderRadius: '6px',
        border: '1px dashed var(--border-color)'
    }
};

export default Dashboard;
