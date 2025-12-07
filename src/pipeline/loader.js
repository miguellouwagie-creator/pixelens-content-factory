/**
 * Viral Trends Loader
 * Loads and parses viral_trends.json file
 */

import * as fs from 'fs/promises';
import { log } from '../utils/helpers.js';

/**
 * Load viral trends from JSON file
 * @param {string} filePath - Path to viral_trends.json
 * @returns {Promise<import('../types.js').ViralTrend[]>} Array of viral trends
 */
export async function loadViralTrends(filePath) {
    try {
        // Read file contents
        const fileContents = await fs.readFile(filePath, 'utf-8');

        // Parse JSON
        const data = JSON.parse(fileContents);

        // Validate it's an array
        if (!Array.isArray(data)) {
            log('error', `Invalid viral_trends.json: Expected array, got ${typeof data}`);
            return [];
        }

        // Filter out invalid entries (missing required fields)
        const validTrends = data.filter(trend => {
            const isValid =
                trend.id &&
                trend.caption &&
                typeof trend.likes === 'number' &&
                typeof trend.comments === 'number' &&
                typeof trend.engagementRate === 'number';

            if (!isValid) {
                log('warn', `Skipping invalid trend entry: ${JSON.stringify(trend).substring(0, 100)}...`);
            }

            return isValid;
        });

        log('info', `Loaded ${validTrends.length} valid trends (${data.length - validTrends.length} skipped)`);
        return validTrends;

    } catch (error) {
        if (error.code === 'ENOENT') {
            log('error', `File not found: ${filePath}`);
        } else if (error instanceof SyntaxError) {
            log('error', `Invalid JSON in file: ${filePath}`, error);
        } else {
            log('error', `Failed to load trends from ${filePath}`, error);
        }

        return []; // Return empty array on any error
    }
}
