/**
 * Configuration Loader
 * Loads and validates environment variables from .env
 */

import dotenv from 'dotenv';

/**
 * Load configuration from environment variables
 * @returns {import('../types.js').Config} Configuration object
 * @throws {Error} If GEMINI_API_KEY is missing
 */
export function loadConfig() {
    // Load .env file
    dotenv.config();

    // Validate required environment variables
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
        throw new Error('MISSING CRITICAL CONFIG: GEMINI_API_KEY not found in .env file');
    }

    // Parse and build config object with defaults
    const config = {
        geminiApiKey,
        apiDelayMs: parseInt(process.env.API_DELAY_MS || '5000', 10),
        inputFile: process.env.INPUT_FILE || 'viral_trends.json',
        outputStrategy: process.env.OUTPUT_STRATEGY || 'output/strategy_briefs.md',
        logLevel: process.env.LOG_LEVEL || 'info',
        logDir: process.env.LOG_DIR || 'logs',
    };

    return config;
}
