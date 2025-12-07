/**
 * Visual Exporter Service
 * Converts HTML visuals to production-ready PNG images using Playwright
 */

import * as path from 'path';
import * as fs from 'fs';
import { chromium, type Browser, type Page } from 'playwright';
import { log } from '../utils/helpers.js';
import type { ContentPiece } from '../types.js';

/**
 * Export HTML visual to PNG image (1080x1080 Instagram format)
 */
export async function exportVisualToPNG(
    contentPiece: ContentPiece,
    visualsDir: string
): Promise<void> {
    const htmlFilename = `post-${contentPiece.id}.html`;
    const pngFilename = `post-${contentPiece.id}.png`;
    const htmlPath = path.join(visualsDir, htmlFilename);
    const pngPath = path.join(visualsDir, pngFilename);

    // Check if HTML file exists
    if (!fs.existsSync(htmlPath)) {
        throw new Error(`HTML file not found: ${htmlPath}`);
    }

    log('info', `🎨 Converting ${htmlFilename} to PNG...`);

    let browser: Browser | null = null;
    let page: Page | null = null;

    try {
        // Launch headless Chromium
        browser = await chromium.launch({ headless: true });
        page = await browser.newPage();

        // Set viewport to Instagram post format (1080x1080)
        await page.setViewportSize({ width: 1080, height: 1080 });

        // Load the HTML file
        const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;
        await page.goto(fileUrl, { waitUntil: 'networkidle' });

        // Wait for fonts and external resources to load
        // Give extra time for Google Fonts and Tailwind CDN
        await page.waitForTimeout(2000);

        // Additional check: wait for fonts to be ready (runs in browser context)
        await page.evaluate(() => {
            return (document as any).fonts.ready;
        });

        // Take screenshot
        await page.screenshot({
            path: pngPath,
            type: 'png',
            fullPage: false, // Only capture viewport (1080x1080)
        });

        log('info', `✅ PNG exported: ${pngFilename}`);

    } catch (error) {
        log('error', `Failed to export PNG for ${contentPiece.id}`, error);
        throw error;
    } finally {
        // Cleanup: Close page and browser
        if (page) await page.close();
        if (browser) await browser.close();
    }
}

/**
 * Export multiple visuals to PNG in batch
 */
export async function exportAllVisualsToPNG(
    contentPieces: ContentPiece[],
    visualsDir: string
): Promise<void> {
    log('info', `Starting PNG export for ${contentPieces.length} visuals`);

    for (const piece of contentPieces) {
        try {
            await exportVisualToPNG(piece, visualsDir);
        } catch (error) {
            log('error', `Skipping PNG export for ${piece.id}`, error);
        }
    }

    log('info', 'PNG export batch complete');
}
