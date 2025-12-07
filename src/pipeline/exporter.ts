/**
 * Content Exporter - Atomic Operations
 * Saves individual content pieces immediately (no batch operations)
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import type { ContentPiece } from '../types.js';
import { createPixelensLayout, createCarouselSlide } from '../templates/pixelens-layout.js';
import { BRAND } from '../constants/brand.js';
import { ensureDirectory, formatDateForDisplay, log } from '../utils/helpers.js';

/**
 * Save a single visual HTML template atomically
 */
export async function saveVisualTemplate(
    contentPiece: ContentPiece,
    visualsDir: string
): Promise<void> {
    // Ensure directory exists
    await ensureDirectory(visualsDir);

    const { id, content, visual } = contentPiece;
    const filename = `post-${id}.html`;
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
    log('info', `Visual saved: ${filename}`);
}

/**
 * Append a single trend to the content calendar (rich text format)
 */
export async function appendTrendToCalendar(
    contentPiece: ContentPiece,
    calendarPath: string
): Promise<void> {
    // Ensure output directory exists
    await ensureDirectory(path.dirname(calendarPath));

    const { id, sourceUrl, content, analysis } = contentPiece;
    const date = formatDateForDisplay(contentPiece.createdAt);

    // Check if calendar file exists
    let fileExists = false;
    try {
        await fs.access(calendarPath);
        fileExists = true;
    } catch {
        fileExists = false;
    }

    // If file doesn't exist, create it with the main title
    if (!fileExists) {
        const header = `# ${BRAND.name} - Content Calendar\n\n`;
        await fs.writeFile(calendarPath, header, 'utf-8');
        log('info', 'Created new content calendar');
    }

    // Build the rich text block for this trend
    const trendBlock = `
---

## Post ${id}: ${content.headline}

**Status:** Draft | **Date:** ${date} | **Source:** ${sourceUrl || 'N/A'}  
**Visual:** [post-${id}.html](visuals/post-${id}.html)

### Content

${content.body}

**CTA:** ${content.cta}

### Metadata

**Keywords:** ${content.keywords.join(', ')}  
**Tone:** ${content.tone}

### Viral Analysis

* **Hook Pattern:** ${analysis.hookPattern}
* **Viral Elements:**
${analysis.viralElements.map(el => `  - ${el}`).join('\n')}
* **Key Takeaways:**
${analysis.keyTakeaways.map(tk => `  - ${tk}`).join('\n')}

`;

    // Append the block to the calendar
    await fs.appendFile(calendarPath, trendBlock, 'utf-8');
    log('info', `Calendar updated: Post ${id}`);
}
