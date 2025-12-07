/**
 * Pixelens Content Factory
 * Main entry point
 */

import { loadConfig } from './config/loader.js';
import { GeminiService } from './services/gemini.js';
import { loadViralTrends } from './pipeline/loader.js';
import { processAllTrends } from './pipeline/processor.js';
import { exportContent } from './pipeline/exporter.js';
import { log } from './utils/helpers.js';
import { BRAND } from './constants/brand.js';

/**
 * Main application function
 */
async function main(): Promise<void> {
    console.log('\n' + '='.repeat(60));
    console.log(`${BRAND.name} - Content Factory`);
    console.log('='.repeat(60) + '\n');

    try {
        // Step 1: Load configuration
        log('info', 'Loading configuration');
        const config = loadConfig();
        log('info', `API Delay: ${config.apiDelayMs}ms`);
        log('info', `Input: ${config.inputFile}`);
        log('info', `Output Calendar: ${config.outputCalendar}`);
        log('info', `Output Visuals: ${config.outputVisualsDir}`);

        // Step 2: Initialize AI service
        log('info', 'Initializing Gemini AI service');
        const geminiService = new GeminiService(config.geminiApiKey, config.apiDelayMs);

        // Step 3: Load viral trends
        log('info', 'Loading viral trends');
        const trends = await loadViralTrends(config.inputFile);

        if (trends.length === 0) {
            log('warn', 'No trends to process. Exiting.');
            return;
        }

        // Step 4: Process trends through AI pipeline
        log('info', `Processing ${trends.length} trends`);
        const startTime = Date.now();
        const results = await processAllTrends(trends, geminiService);
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        // Step 5: Export results
        log('info', 'Exporting results');
        await exportContent(results, config.outputCalendar, config.outputVisualsDir);

        // Summary
        const successCount = results.filter(r => r.success).length;
        const failureCount = results.filter(r => !r.success).length;

        console.log('\n' + '='.repeat(60));
        console.log('SUMMARY');
        console.log('='.repeat(60));
        console.log(`Total Trends: ${trends.length}`);
        console.log(`Successful: ${successCount}`);
        console.log(`Failed: ${failureCount}`);
        console.log(`Duration: ${duration}s`);
        console.log(`Average: ${(parseFloat(duration) / trends.length).toFixed(2)}s per trend`);
        console.log('\nOutput Files:');
        console.log(`  - ${config.outputCalendar}`);
        console.log(`  - ${config.outputVisualsDir}/post-*.html`);
        console.log('='.repeat(60) + '\n');

        if (failureCount > 0) {
            log('warn', `${failureCount} trends failed processing. Check logs for details.`);
        }

        log('info', 'Content Factory completed successfully! 🎉');

    } catch (error) {
        log('error', 'Fatal error in Content Factory', error);
        console.error('\n❌ Application failed. See logs above for details.\n');
        process.exit(1);
    }
}

// Run the application
main();
