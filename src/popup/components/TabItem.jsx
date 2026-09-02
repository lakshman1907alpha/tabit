/**
 * popup/components/TabItem.jsx
 * 
 * Responsibility:
 * - Render individual tab details
 * - Hover effects
 * - Close button
 */

import React, { useState } from 'react';
import { DateUtils } from '../../utils/dateUtils';

const TabItem = ({ tab, onClose }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            style={{
                ...styles.container,
                ...(isHovered ? styles.containerHover : {}),
                ...(tab.isDuplicate ? styles.duplicate : {})
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={styles.info}>
                <img
                    src={tab.favIconUrl || ''}
                    alt=""
                    style={styles.favicon}
                    onError={(e) => e.target.style.display = 'none'}
                />
                <div style={styles.text}>
                    <div style={styles.title} title={tab.title}>{tab.title}</div>
                    <div style={styles.subtext}>
                        {DateUtils.formatDuration(tab.lastAccessed)} • Score: <span style={styles.score}>{tab.score || 0}</span>
                    </div>
                </div>
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClose(tab.id);
                }}
                style={{
                    ...styles.closeBtn,
                    opacity: isHovered ? 1 : 0
                }}
                title="Close Tab"
            >
                ×
            </button>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-primary)', 
        transition: 'background-color 0.2s',
        cursor: 'default',
        position: 'relative'
    },
    containerHover: {
        backgroundColor: 'var(--bg-hover)'
    },
    duplicate: {
        borderLeft: '3px solid var(--danger-color)'
    },
    info: {
        display: 'flex',
        alignItems: 'center',
        flex: 1,
        overflow: 'hidden',
        gap: '12px'
    },
    favicon: {
        width: '16px',
        height: '16px',
        borderRadius: '2px',
        flexShrink: 0
    },
    text: {
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px'
    },
    title: {
        fontSize: '13px',
        fontWeight: '400',
        color: 'var(--text-primary)',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    },
    subtext: {
        fontSize: '11px',
        color: 'var(--text-secondary)'
    },
    score: {
        color: 'var(--accent-primary)',
        fontWeight: '500'
    },
    closeBtn: {
        border: 'none',
        background: 'rgba(0, 0, 0, 0.05)',
        borderRadius: '50%',
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        cursor: 'pointer',
        color: 'var(--text-secondary)',
        transition: 'all 0.2s',
        marginLeft: '8px'
    }
};

export default TabItem;
