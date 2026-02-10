/**
 * logger.js
 * 
 * Responsibility:
 * - Centralized logging
 * - Toggle debug mode
 */

export const Logger = {
    log: (...args) => console.log('[SmartTab]', ...args),
    error: (...args) => console.error('[SmartTab]', ...args),
};
