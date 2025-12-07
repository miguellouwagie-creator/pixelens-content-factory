/**
 * Gemini AI Service
 * Handles all interactions with Google's Generative AI API
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AnalysisResult, CreatorResult, DesignerResult, ViralTrend } from '../types.js';
import { PROMPTS } from '../constants/brand.js';
import { sleep, log, extractJSON, safeJSONParse } from '../utils/helpers.js';

export class GeminiService {
    private ai: GoogleGenerativeAI;
    private model: any;
    private apiDelayMs: number;
    private lastCallTime: number = 0;

    constructor(apiKey: string, apiDelayMs: number = 2000) {
        this.ai = new GoogleGenerativeAI(apiKey);
        this.model = this.ai.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
        this.apiDelayMs = apiDelayMs;
    }

    /**
     * Apply rate limiting before API calls
     */
    private async applyRateLimit(): Promise<void> {
        const now = Date.now();
        const timeSinceLastCall = now - this.lastCallTime;

        if (timeSinceLastCall < this.apiDelayMs) {
            const waitTime = this.apiDelayMs - timeSinceLastCall;
            log('info', `Rate limiting: waiting ${waitTime}ms`);
            await sleep(waitTime);
        }

        this.lastCallTime = Date.now();
    }

    /**
     * Make API call with retry logic
     */
    private async callAPI(prompt: string, maxRetries: number = 3): Promise<string> {
        await this.applyRateLimit();

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                log('info', `API call attempt ${attempt}/${maxRetries}`);
                const result = await this.model.generateContent(prompt);
                const response = await result.response;
                return response.text();
            } catch (error) {
                log('error', `API call failed (attempt ${attempt}/${maxRetries})`, error);

                if (attempt === maxRetries) {
                    throw error;
                }

                // Exponential backoff
                await sleep(1000 * Math.pow(2, attempt));
            }
        }

        throw new Error('Max retries exceeded');
    }

    /**
     * STEP 1: Analyze viral structure
     */
    async analyzeViralStructure(trend: ViralTrend): Promise<AnalysisResult> {
        log('info', `Analyzing viral structure for post ${trend.id}`);

        const prompt = PROMPTS.analyst
            .replace('{caption}', trend.caption)
            .replace('{likes}', trend.likes.toString())
            .replace('{comments}', trend.comments.toString())
            .replace('{engagementRate}', trend.engagementRate.toFixed(2));

        try {
            const response = await this.callAPI(prompt);
            const jsonText = extractJSON(response);
            const parsed = safeJSONParse<AnalysisResult>(jsonText, {
                hookPattern: 'Unable to parse',
                viralElements: [],
                structureBreakdown: response,
                keyTakeaways: [],
            });

            log('info', `Analysis complete for post ${trend.id}`);
            return parsed;
        } catch (error) {
            log('error', `Failed to analyze post ${trend.id}`, error);
            throw error;
        }
    }

    /**
     * STEP 2: Create brand-aligned content
     */
    async createBrandContent(analysis: AnalysisResult): Promise<CreatorResult> {
        log('info', 'Creating brand-aligned content');

        const prompt = PROMPTS.creator
            .replace('{analysis}', JSON.stringify(analysis, null, 2));

        try {
            const response = await this.callAPI(prompt);
            const jsonText = extractJSON(response);
            const parsed = safeJSONParse<CreatorResult>(jsonText, {
                headline: 'Content Creation Failed',
                body: response,
                cta: 'Learn More',
                keywords: [],
                tone: 'professional',
            });

            log('info', 'Content creation complete');
            return parsed;
        } catch (error) {
            log('error', 'Failed to create content', error);
            throw error;
        }
    }

    /**
     * STEP 3: Design visual template
     */
    async designVisualTemplate(content: CreatorResult): Promise<DesignerResult> {
        log('info', 'Designing visual template');

        const prompt = PROMPTS.designer
            .replace('{content}', JSON.stringify(content, null, 2));

        try {
            const response = await this.callAPI(prompt);
            const jsonText = extractJSON(response);
            const parsed = safeJSONParse<DesignerResult>(jsonText, {
                htmlSnippet: '<div>Design failed</div>',
                designNotes: response,
                colorScheme: [],
            });

            log('info', 'Visual design complete');
            return parsed;
        } catch (error) {
            log('error', 'Failed to design visual', error);
            throw error;
        }
    }

    /**
     * Process a single trend through the complete pipeline
     */
    async processTrend(trend: ViralTrend): Promise<{
        analysis: AnalysisResult;
        content: CreatorResult;
        visual: DesignerResult;
    }> {
        log('info', `Processing trend ${trend.id}: ${trend.username}`);

        // Step 1: Analyze
        const analysis = await this.analyzeViralStructure(trend);

        // Step 2: Create
        const content = await this.createBrandContent(analysis);

        // Step 3: Design
        const visual = await this.designVisualTemplate(content);

        log('info', `Completed processing trend ${trend.id}`);

        return { analysis, content, visual };
    }
}
