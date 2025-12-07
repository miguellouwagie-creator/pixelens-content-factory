/**
 * Pixelens Strategy Lab
 * Spanish Copywriting Strategy Engine
 */

import { loadConfig } from './config/loader.js';
import { GeminiService } from './services/gemini.js';
import { loadViralTrends } from './pipeline/loader.js';
import { processAllTrends } from './pipeline/processor.js';

import { log } from './utils/helpers.js';
import { BRAND } from './constants/brand.js';

/**
 * Main application function
 */
async function main(): Promise<void> {
    console.log('\n' + '='.repeat(60));
    console.log(`${BRAND.name} - Laboratorio de Estrategia`);
    console.log('='.repeat(60) + '\n');

    try {
        // Step 1: Load configuration
        log('info', 'Loading configuration');
        const config = loadConfig();
        log('info', `API Delay: ${config.apiDelayMs}ms`);
        log('info', `Input: ${config.inputFile}`);
        log('info', `Output Strategy: ${config.outputStrategy}`);

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

        // Step 4: Process trends through AI strategy pipeline
        log('info', `Processing ${trends.length} trends`);
        const startTime = Date.now();
        await processAllTrends(
            trends,
            geminiService,
            config.outputStrategy
        );
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        // Summary
        console.log('\n' + '='.repeat(60));
        console.log('RESUMEN');
        console.log('='.repeat(60));
        console.log(`Total de Trends: ${trends.length}`);
        console.log(`Duración: ${duration}s`);
        console.log(`Promedio: ${(parseFloat(duration) / trends.length).toFixed(2)}s por trend`);
        console.log('\nArchivo Generado:');
        console.log(`  - ${config.outputStrategy}`);
        console.log('='.repeat(60) + '\n');

        log('info', 'Strategy Lab completed successfully! 🎉');

    } catch (error) {
        log('error', 'Fatal error in Strategy Lab', error);
        console.error('\n❌ Application failed. See logs above for details.\n');
        process.exit(1);
    }
}

// Run the application
main();
