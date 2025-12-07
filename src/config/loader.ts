/**
 * Configuration Loader
 * Loads and validates environment configuration
 */

import { config as loadEnv } from 'dotenv';
import type { Config } from '../types.js';

/**
 * Load configuration from environment variables
 */
export function loadConfig(): Config {
    // Load .env file
    loadEnv();

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
        throw new Error('GEMINI_API_KEY is required in environment variables');
    }

    return {
        geminiApiKey,
        apiDelayMs: parseInt(process.env.API_DELAY_MS || '2000', 10),
        inputFile: process.env.INPUT_FILE || 'viral_trends.json',
        outputCalendar: process.env.OUTPUT_CALENDAR || 'content_calendar.md',
        outputVisualsDir: process.env.OUTPUT_VISUALS_DIR || 'visuals',
        logLevel: process.env.LOG_LEVEL || 'info',
        logDir: process.env.LOG_DIR || 'logs',
    };
}
