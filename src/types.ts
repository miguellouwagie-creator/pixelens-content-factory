/**
 * Core type definitions for Pixelens Content Factory
 */

/**
 * Viral trend data structure from the Trend Scout app
 */
export interface ViralTrend {
    id: string;
    username: string;
    followers: number;
    postUrl: string;
    caption: string;
    likes: number;
    comments: number;
    engagementRate: number;
    postedDate: string;
    hashtags: string[];
    outlierScore?: number;
}

/**
 * Result from AI analysis of viral structure
 */
export interface AnalysisResult {
    hookPattern: string;
    viralElements: string[];
    structureBreakdown: string;
    keyTakeaways: string[];
}

/**
 * Result from AI content creation
 */
export interface CreatorResult {
    headline: string;
    body: string;
    cta: string;
    keywords: string[];
    tone: string;
}

/**
 * Result from AI visual design
 */
export interface DesignerResult {
    htmlSnippet: string;
    designNotes: string;
    colorScheme: string[];
}

/**
 * Complete content piece for output
 */
export interface ContentPiece {
    id: string;
    sourceUrl: string;
    analysis: AnalysisResult;
    content: CreatorResult;
    visual: DesignerResult;
    createdAt: Date;
}

/**
 * Configuration for the application
 */
export interface Config {
    geminiApiKey: string;
    apiDelayMs: number;
    inputFile: string;
    outputCalendar: string;
    outputVisualsDir: string;
    logLevel: string;
    logDir: string;
}

/**
 * Processing result for tracking success/failure
 */
export interface ProcessingResult {
    success: boolean;
    trend: ViralTrend;
    contentPiece?: ContentPiece;
    error?: string;
}
