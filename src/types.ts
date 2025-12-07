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
 * Strategic copywriting result with 3 angles (Spanish)
 */
export interface StrategyResult {
    hook_viral: string;       // Instagram/Twitter - punchy, controversial
    hook_authority: string;   // LinkedIn - data-driven, professional
    hook_sales: string;       // Direct response - conversion focused
    caption_main: string;     // Core value proposition
    visual_brief: string;     // Designer instructions for Nano Banana
}

/**
 * Complete strategy brief for output
 */
export interface ContentPiece {
    id: string;
    sourceUrl: string;
    analysis: AnalysisResult;
    strategy: StrategyResult;
    createdAt: Date;
}

/**
 * Configuration for the application
 */
export interface Config {
    geminiApiKey: string;
    apiDelayMs: number;
    inputFile: string;
    outputStrategy: string;
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
