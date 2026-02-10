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
                <div style={styles.logoContainer}>
                    <span style={styles.logoIcon}>⚡</span>
                    <h1 style={styles.title}>Tabit!</h1>
                </div>
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
        justifyContent: 'space-between',
        backgroundColor: 'rgba(15, 17, 23, 0.8)', // Glass effect base
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
        zIndex: 100
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    logoIcon: {
        fontSize: '20px'
    },
    title: {
        margin: 0,
        fontSize: '18px',
        fontWeight: '700',
        background: 'linear-gradient(90deg, #6366f1, #a855f7)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    main: {
        padding: '20px'
    }
};

export default App;
