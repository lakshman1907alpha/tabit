/**
 * popup/App.jsx
 * 
 * Responsibility:
 * - Application Shell
 * - Glassmorphism Header
 */

import React from 'react';
import Dashboard from './components/Dashboard';

const App = () => {
    return (
        <div style={styles.app}>
            <header style={styles.header}>
                <h1 style={styles.title}>Tabit</h1>
            </header>
            <main style={styles.main}>
                <Dashboard />
            </main>
        </div>
    );
};

const styles = {
    app: {
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
    },
    header: {
        position: 'sticky',
        top: 0,
        height: 'var(--header-height)',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-color)',
        zIndex: 100
    },
    title: {
        margin: 0,
        fontSize: '18px',
        fontWeight: '600',
        color: 'var(--accent-primary)',
        letterSpacing: '-0.5px'
    },
    main: {
        padding: '16px'
    }
};

export default App;
