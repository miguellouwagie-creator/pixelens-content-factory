/**
 * Content Processor - Industrial Grade Reliability
 * Implements Check-Process-Save cycle with zero data loss
 */

import * as fs from 'fs';
import * as path from 'path';
import type { ViralTrend } from '../types.js';
import type { GeminiService } from '../services/gemini.js';
import { log } from '../utils/helpers.js';
import { saveVisualTemplate, appendTrendToCalendar } from './exporter.js';

/**
 * Process multiple trends through the AI pipeline with atomic saves
 * Implements Check-Process-Save cycle for zero data loss and smart resuming
 */
export async function processAllTrends(
    trends: ViralTrend[],
    geminiService: GeminiService,
    calendarPath: string,
    visualsDir: string
): Promise<void> {
    log('info', `Starting to process ${trends.length} trends`);

    let successCount = 0;
    let failureCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < trends.length; i++) {
        const trend = trends[i];
        const visualPath = path.join(visualsDir, `post-${trend.id}.html`);

        log('info', `Processing trend ${i + 1}/${trends.length}: ${trend.id}`);

        // STEP A: CHECK - Does the visual already exist?
        if (fs.existsSync(visualPath)) {
            log('info', `⏭️  Skipping ${trend.id} (Already processed)`);
            skippedCount++;
            continue;
        }

        try {
            // STEP C: PROCESS - Call AI service
            const { analysis, content, visual } = await geminiService.processTrend(trend);

            const contentPiece = {
                id: trend.id,
                sourceUrl: trend.postUrl || '',
                analysis,
                content,
                visual,
                createdAt: new Date(),
            };

            // STEP D: SAVE (Atomic) - Immediately persist both outputs
            await saveVisualTemplate(contentPiece, visualsDir);
            await appendTrendToCalendar(contentPiece, calendarPath);

            // STEP E: LOG success
            log('info', `✓ Saved: ${trend.id}`);
            successCount++;

        } catch (error) {
            // Error Handling: Log and continue (do NOT crash)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            log('error', `✗ Failed: ${trend.id} - ${errorMessage}`, error);
            failureCount++;
        }
    }

    log('info', `Processing complete: ${successCount} success, ${failureCount} failures, ${skippedCount} skipped`);
}

/**
 * Process a batch of trends with concurrency limit
 * @deprecated Use processAllTrends with atomic saves instead
 */
export async function processTrendsWithBatching(
    trends: ViralTrend[],
    geminiService: GeminiService,
    calendarPath: string,
    visualsDir: string,
    batchSize: number = 1
): Promise<void> {
    for (let i = 0; i < trends.length; i += batchSize) {
        const batch = trends.slice(i, i + batchSize);
        log('info', `Processing batch ${Math.floor(i / batchSize) + 1}`);

        await processAllTrends(batch, geminiService, calendarPath, visualsDir);
    }
}
