/**
 * Content Processor - STRATEGY LAB
 * Implements Check-Process-Export cycle for Spanish copywriting strategies
 */

import type { ViralTrend } from '../types.js';
import type { GeminiService } from '../services/gemini.js';
import { log } from '../utils/helpers.js';
import { exportStrategyBrief, initializeStrategyFile } from '../services/strategy_exporter.js';

/**
 * Process multiple trends through the AI strategy pipeline
 */
export async function processAllTrends(
    trends: ViralTrend[],
    geminiService: GeminiService,
    strategyPath: string
): Promise<void> {
    log('info', `Starting to process ${trends.length} trends`);

    let successCount = 0;
    let failureCount = 0;

    try {
        // Initialize the strategy briefs file
        await initializeStrategyFile(strategyPath);

        for (let i = 0; i < trends.length; i++) {
            const trend = trends[i];

            log('info', `Processing trend ${i + 1}/${trends.length}: ${trend.id}`);

            try {
                // PROCESS - Call AI service
                const { analysis, strategy } = await geminiService.processTrend(trend);

                const contentPiece = {
                    id: trend.id,
                    sourceUrl: trend.postUrl || '',
                    analysis,
                    strategy,
                    createdAt: new Date(),
                };

                // EXPORT - Save strategy brief to Markdown
                await exportStrategyBrief(contentPiece, strategyPath);

                // LOG success
                log('info', `✓ Strategy generated: ${trend.id}`);
                successCount++;

            } catch (error) {
                // Error Handling: Log and continue (do NOT crash)
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                log('error', `✗ Failed: ${trend.id} - ${errorMessage}`, error);
                failureCount++;
            }
        }

        log('info', `Processing complete: ${successCount} strategies generated, ${failureCount} failures`);
    } finally {
        log('info', 'Strategy pipeline completed');
    }
}
