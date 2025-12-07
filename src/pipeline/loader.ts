/**
 * Data Loader
 * Loads and validates viral trends from JSON file
 */

import * as fs from 'fs/promises';
import type { ViralTrend } from '../types.js';
import { log } from '../utils/helpers.js';

/**
 * Load viral trends from JSON file
 */
export async function loadViralTrends(filePath: string): Promise<ViralTrend[]> {
    log('info', `Loading viral trends from ${filePath}`);

    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(fileContent);

        // Handle different possible structures
        let trends: ViralTrend[];

        if (Array.isArray(data)) {
            trends = data;
        } else if (data.trends && Array.isArray(data.trends)) {
            trends = data.trends;
        } else if (data.results && Array.isArray(data.results)) {
            trends = data.results;
        } else {
            throw new Error('Invalid JSON structure: expected array of trends');
        }

        // Validate trends
        const validTrends = trends.filter(validateTrend);

        log('info', `Loaded ${validTrends.length} valid trends (${trends.length - validTrends.length} skipped)`);

        return validTrends;
    } catch (error) {
        log('error', `Failed to load viral trends from ${filePath}`, error);
        throw error;
    }
}

/**
 * Validate a single trend object
 */
function validateTrend(trend: any): trend is ViralTrend {
    const required = ['id', 'username', 'caption', 'likes', 'comments'];

    for (const field of required) {
        if (!(field in trend)) {
            log('warn', `Trend missing required field: ${field}`, trend);
            return false;
        }
    }

    // Ensure caption is not empty
    if (!trend.caption || trend.caption.trim().length === 0) {
        log('warn', 'Trend has empty caption', trend);
        return false;
    }

    return true;
}
