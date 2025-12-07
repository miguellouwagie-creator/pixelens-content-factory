/**
 * Utility functions for the application
 */

import * as fs from 'fs/promises';

/**
 * Sleep for specified milliseconds
 */
export async function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Ensure directory exists, create if not
 */
export async function ensureDirectory(dirPath: string): Promise<void> {
    try {
        await fs.access(dirPath);
    } catch {
        await fs.mkdir(dirPath, { recursive: true });
    }
}

/**
 * Format date for filenames (YYYY-MM-DD)
 */
export function formatDateForFilename(date: Date): string {
    return date.toISOString().split('T')[0];
}

/**
 * Format date for display
 */
export function formatDateForDisplay(date: Date): string {
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Safe JSON parse with fallback
 */
export function safeJSONParse<T>(text: string, fallback: T): T {
    try {
        return JSON.parse(text) as T;
    } catch {
        return fallback;
    }
}

/**
 * Extract JSON from markdown code blocks
 */
export function extractJSON(text: string): string {
    // Try to find JSON in code blocks
    const codeBlockMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (codeBlockMatch) {
        return codeBlockMatch[1];
    }

    // Try to find raw JSON object
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        return jsonMatch[0];
    }

    return text;
}

/**
 * Sanitize filename
 */
export function sanitizeFilename(filename: string): string {
    return filename
        .replace(/[^a-z0-9-_]/gi, '-')
        .replace(/-+/g, '-')
        .toLowerCase();
}

/**
 * Log with timestamp
 */
export function log(level: 'info' | 'warn' | 'error', message: string, data?: unknown): void {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    if (data) {
        console.log(prefix, message, data);
    } else {
        console.log(prefix, message);
    }
}
