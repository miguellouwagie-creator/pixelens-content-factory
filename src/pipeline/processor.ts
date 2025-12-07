/**
 * Content Processor
 * Orchestrates the AI pipeline for each trend
 */

import type { ViralTrend, ContentPiece, ProcessingResult } from '../types.js';
import type { GeminiService } from '../services/gemini.js';
import { log } from '../utils/helpers.js';

/**
 * Process multiple trends through the AI pipeline
 */
export async function processAllTrends(
    trends: ViralTrend[],
    geminiService: GeminiService
): Promise<ProcessingResult[]> {
    log('info', `Starting to process ${trends.length} trends`);

    const results: ProcessingResult[] = [];
    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < trends.length; i++) {
        const trend = trends[i];
        log('info', `Processing trend ${i + 1}/${trends.length}: ${trend.id}`);

        try {
            const { analysis, content, visual } = await geminiService.processTrend(trend);

            const contentPiece: ContentPiece = {
                id: trend.id,
                sourceUrl: trend.postUrl || '',
                analysis,
                content,
                visual,
                createdAt: new Date(),
            };

            results.push({
                success: true,
                trend,
                contentPiece,
            });

            successCount++;
            log('info', `✓ Success: ${trend.id}`);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            results.push({
                success: false,
                trend,
                error: errorMessage,
            });

            failureCount++;
            log('error', `✗ Failed: ${trend.id}`, error);
        }
    }

    log('info', `Processing complete: ${successCount} success, ${failureCount} failures`);

    return results;
}

/**
 * Process a batch of trends with concurrency limit
 */
export async function processTrendsWithBatching(
    trends: ViralTrend[],
    geminiService: GeminiService,
    batchSize: number = 1
): Promise<ProcessingResult[]> {
    const results: ProcessingResult[] = [];

    for (let i = 0; i < trends.length; i += batchSize) {
        const batch = trends.slice(i, i + batchSize);
        log('info', `Processing batch ${Math.floor(i / batchSize) + 1}`);

        const batchResults = await processAllTrends(batch, geminiService);
        results.push(...batchResults);
    }

    return results;
}
