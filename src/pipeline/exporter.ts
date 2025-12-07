/**
 * Content Exporter
 * Exports generated content to markdown and HTML files
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import type { ProcessingResult } from '../types.js';
import { createPixelensLayout, createCarouselSlide } from '../templates/pixelens-layout.js';
import { BRAND } from '../constants/brand.js';
import { ensureDirectory, formatDateForDisplay, log } from '../utils/helpers.js';

/**
 * Export all content to calendar and visuals
 */
export async function exportContent(
    results: ProcessingResult[],
    calendarPath: string,
    visualsDir: string
): Promise<void> {
    log('info', 'Exporting content');

    // Ensure output directories exist
    await ensureDirectory(visualsDir);
    await ensureDirectory(path.dirname(calendarPath));

    // Generate calendar markdown
    await exportCalendar(results, calendarPath);

    // Generate visual templates
    await exportVisuals(results, visualsDir);

    log('info', 'Export complete');
}

/**
 * Export content calendar as markdown
 */
async function exportCalendar(results: ProcessingResult[], calendarPath: string): Promise<void> {
    log('info', `Generating content calendar at ${calendarPath}`);

    const successfulResults = results.filter(r => r.success && r.contentPiece);

    let markdown = `# ${BRAND.name} - Content Calendar\n\n`;
    markdown += `Generated: ${formatDateForDisplay(new Date())}\n\n`;
    markdown += `Total Posts: ${successfulResults.length}\n\n`;
    markdown += `---\n\n`;

    successfulResults.forEach((result, index) => {
        if (!result.contentPiece) return;

        const { content, analysis, sourceUrl } = result.contentPiece;
        const postNumber = String(index + 1).padStart(3, '0');

        markdown += `## Post ${postNumber}: ${content.headline}\n\n`;

        markdown += `**Status:** Draft  \n`;
        markdown += `**Visual:** [post-${postNumber}.html](visuals/post-${postNumber}.html)  \n`;
        markdown += `**Source:** ${sourceUrl || 'N/A'}  \n\n`;

        markdown += `### Content\n\n`;
        markdown += `**Headline:**  \n${content.headline}\n\n`;
        markdown += `**Body:**  \n${content.body}\n\n`;
        markdown += `**CTA:**  \n${content.cta}\n\n`;

        markdown += `### Metadata\n\n`;
        markdown += `**Keywords:** ${content.keywords.join(', ')}  \n`;
        markdown += `**Tone:** ${content.tone}  \n\n`;

        markdown += `### Viral Analysis\n\n`;
        markdown += `**Hook Pattern:** ${analysis.hookPattern}\n\n`;
        markdown += `**Viral Elements:**\n`;
        analysis.viralElements.forEach(element => {
            markdown += `- ${element}\n`;
        });
        markdown += `\n`;

        markdown += `**Key Takeaways:**\n`;
        analysis.keyTakeaways.forEach(takeaway => {
            markdown += `- ${takeaway}\n`;
        });
        markdown += `\n`;

        markdown += `---\n\n`;
    });

    // Add failures section
    const failures = results.filter(r => !r.success);
    if (failures.length > 0) {
        markdown += `## Failed Posts\n\n`;
        markdown += `The following posts could not be processed:\n\n`;

        failures.forEach(result => {
            markdown += `- **${result.trend.id}** (${result.trend.username}): ${result.error}\n`;
        });
        markdown += `\n`;
    }

    await fs.writeFile(calendarPath, markdown, 'utf-8');
    log('info', `Calendar exported: ${successfulResults.length} posts`);
}

/**
 * Export visual HTML templates
 */
async function exportVisuals(results: ProcessingResult[], visualsDir: string): Promise<void> {
    log('info', `Generating visual templates in ${visualsDir}`);

    const successfulResults = results.filter(r => r.success && r.contentPiece);

    for (let i = 0; i < successfulResults.length; i++) {
        const result = successfulResults[i];
        if (!result.contentPiece) continue;

        const { content, visual } = result.contentPiece;
        const postNumber = String(i + 1).padStart(3, '0');
        const filename = `post-${postNumber}.html`;
        const filepath = path.join(visualsDir, filename);

        // Use AI-generated HTML if available, otherwise use our template
        let bodyContent: string;

        if (visual.htmlSnippet && visual.htmlSnippet.length > 50) {
            // AI provided HTML
            bodyContent = visual.htmlSnippet;
        } else {
            // Fallback to our template
            bodyContent = createCarouselSlide(
                content.headline,
                content.body,
                content.cta
            );
        }

        const html = createPixelensLayout(bodyContent, `${BRAND.name} - ${content.headline}`);

        await fs.writeFile(filepath, html, 'utf-8');
        log('info', `Visual exported: ${filename}`);
    }

    log('info', `Exported ${successfulResults.length} visual templates`);
}
